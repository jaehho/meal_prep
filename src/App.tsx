import React, { useEffect, useMemo, useState } from 'react'
import { formatQty, unitOrderBias } from './lib/units'
import { MEALS } from './data/meals'
import NumberStepper from './components/NumberStepper'
import Pill from './components/Pill'

type Unit = keyof typeof unitOrderBias
type GroceryItem = { name: string; unit: Unit; qty: number }

const STORAGE_KEY = 'meal-prep-selections-v1'

function keyOf(name: string, unit: Unit) {
  return `${name}__${unit}`.toLowerCase()
}

function useSelections() {
  const [sel, setSel] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sel))
  }, [sel])

  const setBatches = (mealId: string, batches: number) => setSel((p) => ({ ...p, [mealId]: batches }))
  const clear = () => setSel({})
  return { sel, setBatches, clear }
}

function aggregateGroceryList(selections: Record<string, number>): GroceryItem[] {
  const totals = new Map<string, GroceryItem>()
  for (const meal of MEALS) {
    const batches = selections[meal.id] || 0
    if (batches <= 0) continue
    for (const ing of meal.ingredients) {
      const k = keyOf(ing.name, ing.unit as Unit)
      const prev = totals.get(k)
      const add = ing.qty * batches
      if (prev) prev.qty += add
      else totals.set(k, { name: ing.name, unit: ing.unit as Unit, qty: add })
    }
  }
  return Array.from(totals.values()).sort((a, b) => {
    if (unitOrderBias[a.unit] !== unitOrderBias[b.unit]) return unitOrderBias[a.unit] - unitOrderBias[b.unit]
    return a.name.localeCompare(b.name)
  })
}

function toCSV(rows: GroceryItem[]) {
  const header = ['Ingredient', 'Quantity', 'Unit']
  const lines = [header.join(',')]
  for (const r of rows) {
    const name = '"' + r.name.replace(/"/g, '""') + '"'
    lines.push([name, formatQty(r.qty), r.unit].join(','))
  }
  return lines.join('\n')
}

export default function App() {
  const { sel, setBatches, clear } = useSelections()
  const activeMeals = useMemo(() => MEALS.filter((m) => (sel[m.id] || 0) > 0), [sel])
  const groceryList = useMemo(() => aggregateGroceryList(sel), [sel])
  const totalServings = useMemo(() => activeMeals.reduce((acc, m) => acc + m.servingsPerBatch * (sel[m.id] || 0), 0), [activeMeals, sel])
  const csv = useMemo(() => toCSV(groceryList), [groceryList])

  const downloadCSV = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'grocery_list.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container">
      <div className="grid">
        <section>
          <div className="header">
            <h1 className="title">Meal Prep Builder</h1>
            <button className="btn btn-outline" onClick={clear} title="Clear all selections">Clear</button>
          </div>

          <div className="spacer" />

          <div className="card">
            <div className="card-body">
              {MEALS.map((meal) => {
                const batches = sel[meal.id] || 0
                return (
                  <div className="row" key={meal.id}>
                    <div>
                      <div style={{fontWeight:600}}>{meal.name}</div>
                      <div className="chips">
                        <Pill>{meal.servingsPerBatch} servings / batch</Pill>
                        <Pill>{meal.ingredients.length} ingredients</Pill>
                      </div>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                      <span className="muted">Batches</span>
                      <NumberStepper value={batches} setValue={(v) => setBatches(meal.id, v)} min={0} max={50} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="muted" style={{marginTop:8}}>
            Tip: a <b>batch</b> equals one full recipe (usually 4 servings). Increase batches to cook extra for the week.
          </div>
        </section>

        <section>
          <div className="header">
            <h2 className="subtitle">Grocery List</h2>
            <div style={{display:'flex', gap:8}}>
              <button className="btn btn-outline" onClick={() => navigator.clipboard.writeText(csv)} title="Copy tidy grocery list as CSV to clipboard">Copy CSV</button>
              <button className="btn btn-primary" onClick={downloadCSV} title="Download grocery_list.csv">Download CSV</button>
            </div>
          </div>

          <div className="spacer" />

          <div className="card">
            <div className="card-body" style={{padding:0}}>
              <table>
                <thead>
                  <tr>
                    <th>Ingredient</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {groceryList.length === 0 ? (
                    <tr><td className="muted" colSpan={3} style={{padding:'16px'}}>No meals selected yet. Add batches on the left to build a list.</td></tr>
                  ) : (
                    groceryList.map((item) => (
                      <tr key={`${item.name}-${item.unit}`}>
                        <td>{item.name}</td>
                        <td>{formatQty(item.qty)}</td>
                        <td>{item.unit}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card" style={{marginTop:12}}>
            <div className="card-body" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div className="muted">
                <b>Meals selected:</b> {activeMeals.length} ・ <b>Total servings:</b> {totalServings}
              </div>
              {activeMeals.length > 0 && (
                <div className="muted">Includes: {activeMeals.map((m) => m.name).join(', ')}</div>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="footer">
        Data lives in <code>src/data/meals.yaml</code>. Units are standardized: proteins in lb; carbs & veg in oz; condiments in cups/tbsp/tsp; counts where applicable.
      </div>
    </div>
  )
}
