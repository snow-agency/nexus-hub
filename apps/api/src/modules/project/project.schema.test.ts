import { describe, expect, it } from 'vitest';
import { createProjectSchema } from './project.schema.js';
import { createTaskSchema, updateTaskStatusSchema } from '../task/task.schema.js';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

describe('createProjectSchema', () => {
  it('exige un budget positif', () => {
    const valid = createProjectSchema.safeParse({
      name: 'Ferme',
      sector: 'Agri',
      country: 'Togo',
      budgetTotal: 1000,
    });
    const invalid = createProjectSchema.safeParse({
      name: 'Ferme',
      sector: 'Agri',
      country: 'Togo',
      budgetTotal: 0,
    });

    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });
});

describe('task schemas', () => {
  it('valide création et statut', () => {
    expect(
      createTaskSchema.safeParse({
        projectId: '11111111-1111-1111-1111-111111111111',
        title: 'Étude de marché',
      }).success,
    ).toBe(true);

    expect(updateTaskStatusSchema.safeParse({ status: 'FAIT' }).success).toBe(true);
    expect(updateTaskStatusSchema.safeParse({ status: 'EN_COURS' }).success).toBe(false);
  });
});

describe('design-system tokens', () => {
  it('conserve la palette de la maquette dans apps/web', () => {
    const tokensPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../../../web/src/theme/tokens.js',
    );
    const source = readFileSync(tokensPath, 'utf8');

    expect(source).toContain('#005C46');
    expect(source).toContain('#004736');
    expect(source).toContain('#FFB800');
    expect(source).toContain('#F7F5F0');
    expect(source).toContain('#18181B');
    expect(source).toContain('Inter');
  });
});
