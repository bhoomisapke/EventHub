import { useState } from 'react'

export default function CampusTrophy() {
  const [tilt, setTilt] = useState({ x: -8, y: 8 })

  function handleMove(event) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height

    setTilt({
      x: (y - 0.5) * -22,
      y: (x - 0.5) * 34,
    })
  }

  function resetTilt() {
    setTilt({ x: -8, y: 8 })
  }

  return (
    <div
      className="trophy-scene"
      onPointerMove={handleMove}
      onPointerLeave={resetTilt}
    >
      <div className="trophy-glow glow-blue" />
      <div className="trophy-glow glow-gold" />

      <div className="trophy-orbit orbit-one" />
      <div className="trophy-orbit orbit-two" />

      <div className="trophy-turntable">
        <div
          className="trophy-model"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          <div className="trophy-star">✦</div>
          <div className="trophy-cup" />
          <div className="trophy-handle left-handle" />
          <div className="trophy-handle right-handle" />
          <div className="trophy-stem" />
          <div className="trophy-base base-top" />
          <div className="trophy-base base-bottom" />
        </div>
      </div>
    </div>
  )
}