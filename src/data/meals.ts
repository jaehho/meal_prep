import { parse } from 'yaml'
import mealsYaml from './meals.yaml?raw'
import type { Unit } from '../lib/units'

export type Ingredient = { name: string; unit: Unit; qty: number }
export type Meal = { id: string; name: string; servingsPerBatch: number; ingredients: Ingredient[] }

const parsed = parse(mealsYaml) as any[]

function isUnit(u: any): u is Unit {
  return ['lb','oz','cups','tbsp','tsp','cloves','slices','count','stalks'].includes(u)
}

export const MEALS: Meal[] = parsed.map((m, idx) => {
  if (!m.id || !m.name || typeof m.servingsPerBatch !== 'number' || !Array.isArray(m.ingredients)) {
    throw new Error(`Invalid meal at index ${idx}`)
  }
  const ingredients: Ingredient[] = m.ingredients.map((ing: any, j: number) => {
    if (!ing.name || !isUnit(ing.unit) || typeof ing.qty !== 'number') {
      throw new Error(`Invalid ingredient at meal ${m.id} index ${j}`)
    }
    return { name: String(ing.name), unit: ing.unit, qty: ing.qty }
  })
  return { id: String(m.id), name: String(m.name), servingsPerBatch: m.servingsPerBatch, ingredients }
})
