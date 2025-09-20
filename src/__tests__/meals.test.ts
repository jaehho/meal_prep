import { describe, it, expect } from 'vitest'
import { MEALS } from '../data/meals'

describe('Meals data (YAML)', () => {
  it('has 6 meals', () => {
    expect(MEALS.length).toBe(6)
  })
  it('each meal has ingredients', () => {
    MEALS.forEach(m => {
      expect(m.ingredients.length).toBeGreaterThan(0)
    })
  })
})
