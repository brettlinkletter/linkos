import { execFile } from 'child_process';
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

import { logger } from './logger.js';

const execFileAsync = promisify(execFile);

// Anthropic image limits: 5MB per image file, max edge 8000px.
// Formats the API can decode: JPEG, PNG, GIF, WebP.
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_EDGE = 8000;
const SUPPORTED_IMAGE_TYPES = new Set(['jpeg', 'png', 'gif', 'webp']);

export type ImageType =
  | 'jpeg' | 'png' | 'gif' | 'webp'
  | 'heic' | 'avif' | 'tiff' | 'bmp'
  | null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory where all Telegram media is saved
export const UPLOADS_DIR = path.resolve(__dirname, '..', 'workspace', 'uploads');

// Ensure uploads dir exists on module load
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

/**
 * Make an HTTPS GET request and return the response body as a string.
 */
function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // Follow redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        httpsGet(res.headers.location).then(resolve, reject);
        return;
      }

      if (res.statusCode && res.statusCode >= 400) {
        reject(new Error(`HTTP ${res.statusCode} from ${url}`));
        return;
      }

      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Download a file via HTTPS and save it to disk.
 */
function httpsDownload(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // Follow redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        httpsDownload(res.headers.location, dest).then(resolve, reject);
        return;
      }

      if (res.statusCode && res.statusCode >= 400) {
        reject(new Error(`HTTP ${res.statusCode} downloading ${url}`));
        return;
      }

      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', (err) => {
        fs.unlink(dest, () => { /* ignore cleanup error */ });
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Sanitize a filename: replace non-alphanumeric chars (except . and -) with _.
 */
function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-]/g, '_');
}

/**
 * Detect an image's true format from its magic bytes, ignoring the file
 * extension (which is often wrong — e.g. an iPhone HEIC saved as .jpg).
 * Returns null if the bytes don't match any recognised image format.
 */
export function detectImageType(buf: Buffer): ImageType {
  if (buf.length < 12) return null;

  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg';
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png';
  // GIF: "GIF8"
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return 'gif';
  // BMP: "BM"
  if (buf[0] === 0x42 && buf[1] === 0x4d) return 'bmp';
  // TIFF: "II*\0" or "MM\0*"
  if ((buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0x2a && buf[3] === 0x00) ||
      (buf[0] === 0x4d && buf[1] === 0x4d && buf[2] === 0x00 && buf[3] === 0x2a)) return 'tiff';

  // ISO base media (RIFF / ftyp box) — WebP, HEIC, AVIF
  // RIFF....WEBP
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  // ....ftyp<brand>
  if (buf.toString('ascii', 4, 8) === 'ftyp') {
    const brand = buf.toString('ascii', 8, 12);
    if (brand === 'avif' || brand === 'avis') return 'avif';
    // HEIC/HEIF brands
    if (['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1', 'heim', 'heis', 'hevm', 'hevs'].includes(brand)) return 'heic';
  }

  return null;
}

/**
 * Run an image conversion/resize using whatever tool is on the box.
 * Prefers macOS `sips`, falls back to ImageMagick (`magick`/`convert`).
 * Returns true if the conversion produced an output file.
 */
async function convertToPng(input: string, output: string): Promise<boolean> {
  // macOS sips: convert format AND clamp longest edge in one pass via -Z.
  try {
    await execFileAsync('sips', ['-s', 'format', 'png', '-Z', String(MAX_IMAGE_EDGE), input, '-o', output]);
    if (fs.existsSync(output) && fs.statSync(output).size > 0) return true;
  } catch { /* sips not present or failed — try ImageMagick */ }

  // ImageMagick 7 (`magick`) then legacy (`convert`).
  for (const bin of ['magick', 'convert']) {
    try {
      await execFileAsync(bin, [input, '-resize', `${MAX_IMAGE_EDGE}x${MAX_IMAGE_EDGE}>`, output]);
      if (fs.existsSync(output) && fs.statSync(output).size > 0) return true;
    } catch { /* try next */ }
  }

  return false;
}

export interface ImageNormalizationResult {
  /** Path to a file safe to hand to Claude, or null if the image is unusable. */
  path: string | null;
  /** True when the file was converted/resized from the original. */
  converted: boolean;
  /** Human-readable reason when path is null (unprocessable image). */
  reason?: string;
}

/**
 * Validate a downloaded image and, if needed, normalise it into a format and
 * size the Anthropic API can actually decode. This is the guard that stops a
 * bad image from poisoning the session transcript: a HEIC/AVIF from an iPhone,
 * an oversized photo, or a corrupt download all become a clean PNG (or are
 * rejected up front) before they ever reach Claude's Read tool.
 *
 * Returns { path } pointing at a usable file, or { path: null, reason } when
 * the file isn't a decodable image at all.
 */
export async function normalizeImage(localPath: string): Promise<ImageNormalizationResult> {
  let stat: fs.Stats;
  try {
    stat = fs.statSync(localPath);
  } catch {
    return { path: null, converted: false, reason: 'file not found' };
  }
  if (stat.size === 0) return { path: null, converted: false, reason: 'empty file' };

  // Sniff the real format from the first bytes.
  const fd = fs.openSync(localPath, 'r');
  const head = Buffer.alloc(32);
  try {
    fs.readSync(fd, head, 0, 32, 0);
  } finally {
    fs.closeSync(fd);
  }
  const type = detectImageType(head);

  if (type === null) {
    // Not an image at all (e.g. an HTML error page saved as .jpg, or a truncated download).
    return { path: null, converted: false, reason: 'not a recognised image format' };
  }

  // Already a supported format AND within size limits — use as-is.
  if (SUPPORTED_IMAGE_TYPES.has(type) && stat.size <= MAX_IMAGE_BYTES) {
    return { path: localPath, converted: false };
  }

  // Needs normalising: unsupported format (HEIC/AVIF/TIFF/BMP) or oversized.
  const outPath = localPath.replace(/\.[^.]*$/, '') + '.normalized.png';
  const ok = await convertToPng(localPath, outPath);
  if (!ok) {
    logger.warn({ localPath, type, bytes: stat.size }, 'Image normalization failed (no sips/ImageMagick or conversion error)');
    return {
      path: null,
      converted: false,
      reason: SUPPORTED_IMAGE_TYPES.has(type)
        ? `image too large (${Math.round(stat.size / 1024 / 1024)}MB) and could not be resized`
        : `unsupported image format (${type}) and could not be converted`,
    };
  }

  // If the converted PNG is still over the byte limit, it's an enormous image — reject.
  const outSize = fs.statSync(outPath).size;
  if (outSize > MAX_IMAGE_BYTES) {
    try { fs.unlinkSync(outPath); } catch { /* ignore */ }
    return { path: null, converted: false, reason: `image too large even after resizing (${Math.round(outSize / 1024 / 1024)}MB)` };
  }

  logger.info({ from: type, localPath, outPath, outSize }, 'Normalized image for API compatibility');
  return { path: outPath, converted: true };
}

/**
 * Download a file from Telegram and save it to workspace/uploads/.
 * Returns the local file path.
 *
 * Steps:
 * 1. GET https://api.telegram.org/bot{TOKEN}/getFile?file_id={fileId}
 *    -> response: { ok: true, result: { file_path: "photos/file_123.jpg" } }
 * 2. Download from https://api.telegram.org/file/bot{TOKEN}/{file_path}
 * 3. Save to UPLOADS_DIR/{timestamp}_{sanitized_filename}
 * 4. Return the local path
 */
export async function downloadMedia(
  botToken: string,
  fileId: string,
  originalFilename?: string,
): Promise<string> {
  // Step 1: Get the file path from Telegram
  const getFileUrl = `https://api.telegram.org/bot${botToken}/getFile?file_id=${encodeURIComponent(fileId)}`;
  const responseBody = await httpsGet(getFileUrl);
  const parsed = JSON.parse(responseBody) as { ok: boolean; result?: { file_path?: string } };

  if (!parsed.ok || !parsed.result?.file_path) {
    throw new Error(`Telegram getFile failed for file_id=${fileId}: ${responseBody}`);
  }

  const telegramFilePath = parsed.result.file_path;

  // Determine the local filename
  let filename: string;
  if (originalFilename) {
    filename = sanitizeFilename(originalFilename);
  } else {
    // Infer from the Telegram file_path (e.g. "photos/file_123.jpg" -> "file_123.jpg")
    const basename = path.basename(telegramFilePath);
    filename = sanitizeFilename(basename);
  }

  const localFilename = `${Date.now()}_${filename}`;
  const localPath = path.join(UPLOADS_DIR, localFilename);

  // Step 2: Download the file
  const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${telegramFilePath}`;
  await httpsDownload(downloadUrl, localPath);

  return localPath;
}

/**
 * Build the message text to send to Claude when a photo is received.
 * Claude Code's Read tool can open image files -- just give it the path.
 */
export function buildPhotoMessage(localPath: string, caption?: string): string {
  let msg = `Photo received. File saved at: ${localPath}`;
  if (caption) {
    msg += `\nCaption: "${caption}"`;
  }
  msg += '\nPlease analyze this image.';
  return msg;
}

/**
 * Build the message text to send to Claude when a document is received.
 */
export function buildDocumentMessage(localPath: string, filename: string, caption?: string): string {
  let msg = `Document received: ${filename}\nFile saved at: ${localPath}`;
  if (caption) {
    msg += `\nCaption: "${caption}"`;
  }
  msg += '\nPlease read and process this file.';
  return msg;
}

/**
 * Build the message text to send to Claude when a video is received.
 * Instructs Claude to use the gemini-api-dev skill for video understanding.
 */
export function buildVideoMessage(localPath: string, caption?: string): string {
  let msg = `Video received. File saved at: ${localPath}`;
  if (caption) {
    msg += `\nCaption: "${caption}"`;
  }
  msg += '\nUse the gemini-api-dev skill with the GOOGLE_API_KEY from .env to analyze this video. Summarize what is in it and transcribe any spoken content.';
  return msg;
}

/**
 * Clean up old files from workspace/uploads/.
 * Deletes files older than maxAgeMs (default: 24 hours).
 */
export function cleanupOldUploads(maxAgeMs: number = 24 * 60 * 60 * 1000): void {
  let entries: string[];
  try {
    entries = fs.readdirSync(UPLOADS_DIR);
  } catch {
    return;
  }

  const now = Date.now();
  let deleted = 0;

  for (const entry of entries) {
    const fullPath = path.join(UPLOADS_DIR, entry);
    try {
      const stat = fs.statSync(fullPath);
      if (!stat.isFile()) continue;
      if (now - stat.mtimeMs > maxAgeMs) {
        fs.unlinkSync(fullPath);
        deleted++;
      }
    } catch {
      // Skip files we can't stat or delete
    }
  }

  if (deleted > 0) {
    logger.info({ deleted, dir: UPLOADS_DIR }, 'Cleaned up old uploads');
  }
}
