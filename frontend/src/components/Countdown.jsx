import { useEffect, useState } from 'react'

const target = new Date('2026-10-14T09:00:00')

export default function Countdown() {
  const getTime = () => {
    const left = Math.max(0, target - new Date())

    return {
      Days: Math.floor(left / 864e5),
      Hrs: Math.floor(left / 36e5) % 24,
      Min: Math.floor(left / 6e4) % 60,
      Sec: Math.floor(left / 1e3) % 60,
    }
  }

  const [time, setTime] = useState(getTime)

  useEffect(() => {
    const timer = setInterval(() => setTime(getTime()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="countdown">
      {Object.entries(time).map(([label, value]) => (
        <div key={label}>
          <strong>{String(value).padStart(2, '0')}</strong>
          <small>{label}</small>
        </div>
      ))}
    </div>
  )
}