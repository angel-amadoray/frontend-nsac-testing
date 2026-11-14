interface TemperatureGaugeProps {
  temperatureK: number
}

export function TemperatureGauge({ temperatureK }: TemperatureGaugeProps) {
  // Escala logarítmica: 1000K (rojo) → 20000K (azul)
  const logMin = Math.log10(1000)
  const logMax = Math.log10(20000)
  const clamped = Math.max(1000, Math.min(20000, temperatureK))
  const pct = ((Math.log10(clamped) - logMin) / (logMax - logMin)) * 100

  return (
    <div>
      <div
        className="relative h-3 rounded-full"
        style={{
          background: `linear-gradient(to right,
            #dc2626 0%,
            #f59e0b 30%,
            #fbbf24 45%,
            #e0e7ff 60%,
            #93c5fd 80%,
            #0284c7 100%)`,
        }}
      >
        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black shadow-lg"
          style={{ left: `${pct}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[10px] text-text-secondary/50">
        <span>1,000 K</span>
        <span>5,000 K</span>
        <span>20,000 K</span>
      </div>
    </div>
  )
}