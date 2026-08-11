import { describe, it, expect } from 'vitest';

import { isAuthError } from './auth-watchdog.js';

describe('isAuthError', () => {
  it('matches the real SDK 401 auth failure from the logs', () => {
    const err = new Error(
      'Claude Code returned an error result: Failed to authenticate. API Error: 401 ' +
        '{"type":"error","error":{"type":"authentication_error","message":"Invalid authentication credentials"},"request_id":"req_x"}',
    );
    expect(isAuthError(err)).toBe(true);
  });

  it('matches on authentication_error alone', () => {
    expect(isAuthError(new Error('authentication_error'))).toBe(true);
  });

  it('matches expired OAuth token phrasing', () => {
    expect(isAuthError(new Error('OAuth token has expired'))).toBe(true);
  });

  it('accepts non-Error values', () => {
    expect(isAuthError('Failed to authenticate')).toBe(true);
  });

  it('does NOT match unrelated errors', () => {
    expect(isAuthError(new Error('exited with code 1'))).toBe(false);
    expect(isAuthError(new Error('context window exhausted'))).toBe(false);
    expect(isAuthError(new Error('ECONNRESET'))).toBe(false);
    expect(isAuthError(new Error('image exceeds maximum size'))).toBe(false);
    expect(isAuthError(null)).toBe(false);
  });
});
