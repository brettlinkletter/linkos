import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';
import { buildPhotoMessage, buildDocumentMessage, cleanupOldUploads, UPLOADS_DIR, detectImageType, normalizeImage } from './media.js';

describe('buildPhotoMessage', () => {
  it('returns string containing the file path', () => {
    const msg = buildPhotoMessage('/tmp/photo.jpg');
    expect(msg).toContain('/tmp/photo.jpg');
  });

  it('includes caption when provided', () => {
    const msg = buildPhotoMessage('/tmp/photo.jpg', 'My vacation');
    expect(msg).toContain('My vacation');
  });

  it('works without caption', () => {
    const msg = buildPhotoMessage('/tmp/photo.jpg');
    expect(msg).not.toContain('Caption');
  });

  it('output mentions "Photo" or "image"', () => {
    const msg = buildPhotoMessage('/tmp/photo.jpg');
    const lower = msg.toLowerCase();
    expect(lower.includes('photo') || lower.includes('image')).toBe(true);
  });
});

describe('buildDocumentMessage', () => {
  it('returns string containing the file path', () => {
    const msg = buildDocumentMessage('/tmp/doc.pdf', 'doc.pdf');
    expect(msg).toContain('/tmp/doc.pdf');
  });

  it('returns string containing the filename', () => {
    const msg = buildDocumentMessage('/tmp/doc.pdf', 'report.pdf');
    expect(msg).toContain('report.pdf');
  });

  it('includes caption when provided', () => {
    const msg = buildDocumentMessage('/tmp/doc.pdf', 'doc.pdf', 'Annual report');
    expect(msg).toContain('Annual report');
  });

  it('works without caption', () => {
    const msg = buildDocumentMessage('/tmp/doc.pdf', 'doc.pdf');
    expect(msg).not.toContain('Caption');
  });
});

describe('cleanupOldUploads', () => {
  it('does not throw when UPLOADS_DIR exists and is empty', () => {
    // UPLOADS_DIR is created on module load, so it exists
    expect(() => cleanupOldUploads()).not.toThrow();
  });

  it('does not throw when called with default maxAge', () => {
    expect(() => cleanupOldUploads()).not.toThrow();
  });

  it('deletes old files but keeps new files', () => {
    // Create a temp subdir inside UPLOADS_DIR for isolation
    const testDir = path.join(UPLOADS_DIR, 'cleanup-test');
    fs.mkdirSync(testDir, { recursive: true });

    const oldFile = path.join(UPLOADS_DIR, 'old-cleanup-test.txt');
    const newFile = path.join(UPLOADS_DIR, 'new-cleanup-test.txt');

    try {
      // Write both files
      fs.writeFileSync(oldFile, 'old content');
      fs.writeFileSync(newFile, 'new content');

      // Backdate the old file by 48 hours
      const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
      fs.utimesSync(oldFile, twoDaysAgo, twoDaysAgo);

      cleanupOldUploads();

      // Old file should be deleted
      expect(fs.existsSync(oldFile)).toBe(false);
      // New file should remain
      expect(fs.existsSync(newFile)).toBe(true);
    } finally {
      // Cleanup
      try { fs.unlinkSync(newFile); } catch { /* ignore */ }
      try { fs.unlinkSync(oldFile); } catch { /* ignore */ }
      try { fs.rmdirSync(testDir); } catch { /* ignore */ }
    }
  });
});

describe('detectImageType', () => {
  const pad = (bytes: number[]) => Buffer.concat([Buffer.from(bytes), Buffer.alloc(32)]);

  it('detects JPEG from magic bytes', () => {
    expect(detectImageType(pad([0xff, 0xd8, 0xff, 0xe0]))).toBe('jpeg');
  });

  it('detects PNG from magic bytes', () => {
    expect(detectImageType(pad([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe('png');
  });

  it('detects GIF from magic bytes', () => {
    expect(detectImageType(pad([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]))).toBe('gif');
  });

  it('detects WebP from RIFF/WEBP header', () => {
    const buf = Buffer.from('RIFF\0\0\0\0WEBPVP8 ', 'ascii');
    expect(detectImageType(buf)).toBe('webp');
  });

  it('detects HEIC from ftyp brand', () => {
    const buf = Buffer.from('\0\0\0\x18ftypheic\0\0\0\0mif1', 'ascii');
    expect(detectImageType(buf)).toBe('heic');
  });

  it('detects AVIF from ftyp brand', () => {
    const buf = Buffer.from('\0\0\0\x18ftypavif\0\0\0\0mif1', 'ascii');
    expect(detectImageType(buf)).toBe('avif');
  });

  it('returns null for non-image content (e.g. an HTML error page)', () => {
    expect(detectImageType(Buffer.from('<!DOCTYPE html><html><body>Not found', 'ascii'))).toBe(null);
  });

  it('returns null for buffers too short to identify', () => {
    expect(detectImageType(Buffer.from([0xff, 0xd8]))).toBe(null);
  });
});

describe('normalizeImage', () => {
  it('rejects a missing file', async () => {
    const res = await normalizeImage('/tmp/does-not-exist-xyz.jpg');
    expect(res.path).toBe(null);
    expect(res.reason).toMatch(/not found/);
  });

  it('rejects an empty file', async () => {
    const p = path.join(UPLOADS_DIR, 'empty-test.jpg');
    fs.writeFileSync(p, '');
    try {
      const res = await normalizeImage(p);
      expect(res.path).toBe(null);
      expect(res.reason).toMatch(/empty/);
    } finally {
      try { fs.unlinkSync(p); } catch { /* ignore */ }
    }
  });

  it('rejects a file that is not a recognised image (HTML masquerading as .jpg)', async () => {
    const p = path.join(UPLOADS_DIR, 'fake-image-test.jpg');
    fs.writeFileSync(p, '<!DOCTYPE html><html>error page</html>');
    try {
      const res = await normalizeImage(p);
      expect(res.path).toBe(null);
      expect(res.reason).toMatch(/not a recognised image/);
    } finally {
      try { fs.unlinkSync(p); } catch { /* ignore */ }
    }
  });

  it('passes through a small valid PNG unchanged', async () => {
    // 1x1 transparent PNG
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64',
    );
    const p = path.join(UPLOADS_DIR, 'valid-test.png');
    fs.writeFileSync(p, png);
    try {
      const res = await normalizeImage(p);
      expect(res.path).toBe(p);
      expect(res.converted).toBe(false);
    } finally {
      try { fs.unlinkSync(p); } catch { /* ignore */ }
    }
  });
});

describe('UPLOADS_DIR', () => {
  it('is an absolute path', () => {
    expect(path.isAbsolute(UPLOADS_DIR)).toBe(true);
  });

  it('ends with workspace/uploads', () => {
    expect(UPLOADS_DIR).toMatch(/workspace[/\\]uploads$/);
  });
});
