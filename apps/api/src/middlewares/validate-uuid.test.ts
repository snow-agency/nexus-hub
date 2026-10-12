import { describe, expect, it, vi } from 'vitest';
import { validateUuidParam } from './validate-uuid.js';
import type { Request, Response } from 'express';

function mockRes() {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
}

describe('validateUuidParam', () => {
  it('laisse passer un UUID valide', () => {
    const req = {
      params: { projectId: '00000000-0000-0000-0000-000000000000' },
    } as unknown as Request;
    const res = mockRes();
    const next = vi.fn();

    validateUuidParam('projectId')(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('bloque un identifiant invalide avec un 400', () => {
    const req = { params: { projectId: 'pas-un-uuid' } } as unknown as Request;
    const res = mockRes();
    const next = vi.fn();

    validateUuidParam('projectId')(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
