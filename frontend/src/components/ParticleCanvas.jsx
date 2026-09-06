import { useEffect, useRef } from 'react'

export default function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const mouse = { x: -1000, y: -1000 }
    let animationFrame
    let particles = []

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      canvas.width = width * dpr
      canvas.height = height * dpr
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const totalParticles = Math.min(Math.floor(width / 9), 150)

      particles = Array.from({ length: totalParticles }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.4 + 0.8,
        speedX: (Math.random() - 0.5) * 0.42,
        speedY: (Math.random() - 0.5) * 0.42,
        color: Math.random() > 0.78 ? '#ffb347' : '#c5e4ff',
        shape: Math.random() > 0.88 ? 'diamond' : 'circle',
      }))
    }

    const drawParticle = (particle) => {
      context.save()
      context.fillStyle = particle.color
      context.shadowColor = particle.color
      context.shadowBlur = 15

      if (particle.shape === 'diamond') {
        context.translate(particle.x, particle.y)
        context.rotate(Math.PI / 4)
        context.fillRect(
          -particle.radius,
          -particle.radius,
          particle.radius * 2,
          particle.radius * 2
        )
      } else {
        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fill()
      }

      context.restore()
    }

    const animate = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      context.clearRect(0, 0, width, height)

      particles.forEach((particle, index) => {
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 170) {
          particle.x -= dx * 0.006
          particle.y -= dy * 0.006
        }

        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > height) particle.speedY *= -1

        drawParticle(particle)

        for (let secondIndex = index + 1; secondIndex < particles.length; secondIndex++) {
          const secondParticle = particles[secondIndex]
          const xDistance = particle.x - secondParticle.x
          const yDistance = particle.y - secondParticle.y
          const particleDistance = Math.sqrt(
            xDistance * xDistance + yDistance * yDistance
          )

          if (particleDistance < 105) {
            context.beginPath()
            context.strokeStyle = `rgba(95, 154, 255, ${
              0.15 - particleDistance / 900
            })`
            context.lineWidth = 0.7
            context.moveTo(particle.x, particle.y)
            context.lineTo(secondParticle.x, secondParticle.y)
            context.stroke()
          }
        }
      })

      animationFrame = requestAnimationFrame(animate)
    }

    const moveMouse = (event) => {
      const bounds = canvas.getBoundingClientRect()
      mouse.x = event.clientX - bounds.left
      mouse.y = event.clientY - bounds.top
    }

    const leaveMouse = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    resize()
    animate()

    window.addEventListener('resize', resize)
    canvas.addEventListener('pointermove', moveMouse)
    canvas.addEventListener('pointerleave', leaveMouse)

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', moveMouse)
      canvas.removeEventListener('pointerleave', leaveMouse)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-canvas" />
}