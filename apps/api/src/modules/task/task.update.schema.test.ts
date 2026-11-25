import { describe, expect, it } from 'vitest';
import { updateTaskSchema } from './task.schema.js';

describe('updateTaskSchema', () => {
  it('accepte un titre seul', () => {
    expect(updateTaskSchema.safeParse({ title: 'Nouveau titre' }).success).toBe(true);
  });

  it('accepte une échéance seule', () => {
    expect(updateTaskSchema.safeParse({ dueDate: '2030-01-01T00:00:00.000Z' }).success).toBe(true);
  });

  it("accepte null pour effacer l'échéance", () => {
    expect(updateTaskSchema.safeParse({ dueDate: null }).success).toBe(true);
  });

  it('refuse un corps vide', () => {
    expect(updateTaskSchema.safeParse({}).success).toBe(false);
  });

  it("refuse un titre d'un seul caractère", () => {
    expect(updateTaskSchema.safeParse({ title: 'a' }).success).toBe(false);
  });
});
