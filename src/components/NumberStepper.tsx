import React from 'react'

type Props = {
  value: number
  setValue: (_value: number) => void
  min?: number
  max?: number
  disabled?: boolean
  label?: string
}

export default function NumberStepper({
  value,
  setValue,
  min = 0,
  max = 99,
  disabled,
  label,
}: Props) {
  return (
    <div className="stepper" aria-label={label || 'number stepper'}>
      <button onClick={() => setValue(Math.max(min, value - 1))} disabled={disabled || value <= min} aria-label="decrease">−</button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const n = Number(e.target.value)
          if (!Number.isNaN(n)) setValue(Math.min(max, Math.max(min, n)))
        }}
      />
      <button onClick={() => setValue(Math.min(max, value + 1))} disabled={disabled || value >= max} aria-label="increase">+</button>
    </div>
  )
}
