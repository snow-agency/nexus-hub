import { vi, describe, beforeEach, expect, it } from 'vitest';

const testState = vi.hoisted(() => {
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
  process.env.ANTHROPIC_API_KEY = '';
  process.env.GOOGLE_AI_API_KEY = '';

  return {
    prisma: {
      user: {
        create: vi.fn(),
        findUnique: vi.fn(),
      },
      project: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      task: {
        create: vi.fn(),
        findMany: vi.fn(),
      },
      transaction: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

vi.mock('../db/prisma.js', () => ({ prisma: testState.prisma }));

import supertest from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma.js';
import app from '../app.js';

const request = supertest(app);
const projectId = '11111111-1111-4111-8111-111111111111';
const transactionId = '22222222-2222-4222-8222-222222222222';
const authHeader = () =>
  `Bearer ${jwt.sign({ userId: 'user-1' }, process.env.JWT_SECRET as string)}`;

describe('garde-fou', () => {
  it('garde-fou', () => {
    expect(prisma).toBe(testState.prisma);
    expect(vi.isMockFunction(prisma.user.create)).toBe(true);
    expect(process.env.DATABASE_URL).toBe('postgresql://test:test@localhost:5432/test');
  });
});

describe('routes API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    testState.prisma.user.create.mockResolvedValue(null);
    testState.prisma.user.findUnique.mockResolvedValue(null);
    testState.prisma.project.findFirst.mockResolvedValue(null);
    testState.prisma.project.findMany.mockResolvedValue([]);
    testState.prisma.project.create.mockResolvedValue(null);
    testState.prisma.project.update.mockResolvedValue(null);
    testState.prisma.task.create.mockResolvedValue(null);
    testState.prisma.task.findMany.mockResolvedValue([]);
    testState.prisma.transaction.findMany.mockResolvedValue([]);
    testState.prisma.transaction.findFirst.mockResolvedValue(null);
    testState.prisma.transaction.delete.mockResolvedValue(null);
  });

  describe('POST /auth/register', () => {
    it('inscrit un utilisateur valide', async () => {
      testState.prisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Utilisateur Test',
      });

      const response = await request.post('/auth/register').send({
        email: 'test@example.com',
        password: 'motdepasse123',
        name: 'Utilisateur Test',
      });

      expect(response.status).toBe(201);
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('passwordHash');
      expect(response.body.email).toBe('test@example.com');
      expect(testState.prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            passwordHash: expect.any(String),
          }),
        }),
      );
      expect(testState.prisma.user.create.mock.calls[0][0].data.passwordHash).not.toBe(
        'motdepasse123',
      );
    });

    it('refuse un corps invalide', async () => {
      const response = await request.post('/auth/register').send({
        email: 'invalide',
        password: 'court',
        name: 'A',
      });

      expect(response.status).toBe(400);
      expect(testState.prisma.user.create).not.toHaveBeenCalled();
    });

    it('refuse un email déjà utilisé', async () => {
      testState.prisma.user.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('duplicate', {
          code: 'P2002',
          clientVersion: '5.19.1',
        }),
      );

      const response = await request.post('/auth/register').send({
        email: 'test@example.com',
        password: 'motdepasse123',
        name: 'Utilisateur Test',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Cet email est déjà utilisé.' });
    });
  });

  describe('POST /auth/login', () => {
    it('connecte un utilisateur avec un bon mot de passe', async () => {
      testState.prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Utilisateur Test',
        passwordHash: bcrypt.hashSync('motdepasse123', 4),
      });

      const response = await request.post('/auth/login').send({
        email: 'test@example.com',
        password: 'motdepasse123',
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeTruthy();
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('refuse un utilisateur inconnu', async () => {
      const response = await request.post('/auth/login').send({
        email: 'inconnu@example.com',
        password: 'motdepasse123',
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Email ou mot de passe incorrect.' });
    });

    it('refuse un mauvais mot de passe', async () => {
      testState.prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Utilisateur Test',
        passwordHash: bcrypt.hashSync('motdepasse123', 4),
      });

      const response = await request.post('/auth/login').send({
        email: 'test@example.com',
        password: 'mauvaismotdepasse',
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Email ou mot de passe incorrect.' });
    });
  });

  describe('GET /auth/me', () => {
    it('renvoie l’utilisateur du token valide', async () => {
      testState.prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Utilisateur Test',
      });

      const response = await request.get('/auth/me').set('Authorization', authHeader());

      expect(response.status).toBe(200);
      expect(response.body.id).toBe('user-1');
    });

    it('refuse une requête sans token', async () => {
      const response = await request.get('/auth/me');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Token manquant.' });
    });
  });

  describe('GET /projects/:id', () => {
    it('renvoie le projet appartenant à l’utilisateur', async () => {
      testState.prisma.project.findFirst.mockResolvedValue({
        id: projectId,
        name: 'Projet Test',
        userId: 'user-1',
      });

      const response = await request
        .get(`/projects/${projectId}`)
        .set('Authorization', authHeader());

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(projectId);
      expect(testState.prisma.project.findFirst).toHaveBeenCalledWith({
        where: { id: projectId, userId: 'user-1' },
      });
    });

    it('renvoie 404 si le projet est introuvable', async () => {
      const response = await request
        .get(`/projects/${projectId}`)
        .set('Authorization', authHeader());

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Projet introuvable.' });
      expect(testState.prisma.project.findFirst).toHaveBeenCalledWith({
        where: { id: projectId, userId: 'user-1' },
      });
    });
  });

  describe('POST /tasks', () => {
    it('crée une tâche dans un projet de l’utilisateur', async () => {
      testState.prisma.project.findFirst.mockResolvedValue({
        id: projectId,
        userId: 'user-1',
      });
      testState.prisma.task.create.mockResolvedValue({
        id: '33333333-3333-4333-8333-333333333333',
        projectId,
        title: 'Préparer le lancement',
      });

      const response = await request.post('/tasks').set('Authorization', authHeader()).send({
        projectId,
        title: 'Préparer le lancement',
      });

      expect(response.status).toBe(201);
      expect(response.body.projectId).toBe(projectId);
      expect(testState.prisma.project.findFirst).toHaveBeenCalledWith({
        where: { id: projectId, userId: 'user-1' },
      });
    });

    it('renvoie 404 si le projet est introuvable', async () => {
      const response = await request.post('/tasks').set('Authorization', authHeader()).send({
        projectId,
        title: 'Préparer le lancement',
      });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Projet introuvable.' });
      expect(testState.prisma.project.findFirst).toHaveBeenCalledWith({
        where: { id: projectId, userId: 'user-1' },
      });
      expect(testState.prisma.task.create).not.toHaveBeenCalled();
    });
  });

  describe('GET /finance/categories', () => {
    it('renvoie la liste des catégories', async () => {
      const response = await request.get('/finance/categories').set('Authorization', authHeader());

      expect(response.status).toBe(200);
      expect(response.body.categories).toContain('MARKETING');
      expect(response.body.categories).toContain('AUTRE');
    });

    it('refuse une requête sans token', async () => {
      const response = await request.get('/finance/categories');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Token manquant.' });
    });
  });

  describe('GET /finance/project/:projectId', () => {
    it('renvoie le résumé financier du projet', async () => {
      testState.prisma.project.findFirst.mockResolvedValue({
        id: projectId,
        userId: 'user-1',
        budgetTotal: 1000,
      });
      testState.prisma.transaction.findMany.mockResolvedValue([
        { type: 'DEPENSE', amount: 200 },
        { type: 'REVENU', amount: 500 },
      ]);

      const response = await request
        .get(`/finance/project/${projectId}`)
        .set('Authorization', authHeader());

      expect(response.status).toBe(200);
      expect(response.body.totalDepenses).toBe(200);
      expect(response.body.totalRevenus).toBe(500);
      expect(response.body.budgetRestant).toBe(800);
      expect(testState.prisma.project.findFirst).toHaveBeenCalledWith({
        where: { id: projectId, userId: 'user-1' },
      });
    });

    it('renvoie 404 si le projet est introuvable', async () => {
      const response = await request
        .get(`/finance/project/${projectId}`)
        .set('Authorization', authHeader());

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Projet introuvable.' });
      expect(testState.prisma.project.findFirst).toHaveBeenCalledWith({
        where: { id: projectId, userId: 'user-1' },
      });
    });
  });

  describe('DELETE /finance/:transactionId', () => {
    it('supprime une transaction appartenant à l’utilisateur', async () => {
      testState.prisma.transaction.findFirst.mockResolvedValue({
        id: transactionId,
        project: { userId: 'user-1' },
      });

      const response = await request
        .delete(`/finance/${transactionId}`)
        .set('Authorization', authHeader());

      expect(response.status).toBe(204);
      expect(testState.prisma.transaction.findFirst).toHaveBeenCalledWith({
        where: {
          id: transactionId,
          project: { userId: 'user-1' },
        },
      });
      expect(testState.prisma.transaction.delete).toHaveBeenCalledWith({
        where: { id: transactionId },
      });
    });

    it('renvoie 404 si la transaction est introuvable', async () => {
      const response = await request
        .delete(`/finance/${transactionId}`)
        .set('Authorization', authHeader());

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Transaction introuvable.' });
      expect(testState.prisma.transaction.findFirst).toHaveBeenCalledWith({
        where: {
          id: transactionId,
          project: { userId: 'user-1' },
        },
      });
      expect(testState.prisma.transaction.delete).not.toHaveBeenCalled();
    });
  });
});
