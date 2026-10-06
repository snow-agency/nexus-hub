import { describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { authMiddleware, type AuthRequest } from './auth.middleware.js';
import { asyncHandler } from './async-handler.js';
import { errorHandler } from './error-handler.js';
import type { NextFunction, Request, Response } from 'express';

function mockRes() {
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
  return res as typeof res & Response;
}

describe('authMiddleware', () => {
  it('refuse une requête sans Bearer token', () => {
    const req = { headers: {} } as AuthRequest;
    const res = mockRes();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: 'Token manquant.' });
  });

  it('refuse un token invalide', () => {
    const req = { headers: { authorization: 'Bearer fake' } } as AuthRequest;
    const res = mockRes();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: 'Token invalide ou expiré.' });
  });

  it('injecte userId pour un JWT valide', () => {
    const token = jwt.sign({ userId: 'user-42' }, process.env.JWT_SECRET as string);
    const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest;
    const res = mockRes();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(req.userId).toBe('user-42');
    expect(next).toHaveBeenCalledOnce();
  });
});

describe('asyncHandler', () => {
  it('transmet une erreur asynchrone à next', async () => {
    const error = new Error('boom');

    await new Promise<void>((resolve, reject) => {
      const handler = asyncHandler(async () => {
        throw error;
      });

      handler({} as Request, mockRes(), (err) => {
        try {
          expect(err).toBe(error);
          resolve();
        } catch (assertionError) {
          reject(assertionError);
        }
      });
    });
  });
});

describe('errorHandler', () => {
  it('masque le détail et répond 500', () => {
    const res = mockRes();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    errorHandler(new Error('secret'), {} as Request, res, {} as NextFunction);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Une erreur interne est survenue.' });
    consoleSpy.mockRestore();
  });
});
