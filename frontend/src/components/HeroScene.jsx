// Paste your published Spline scene URL here when ready.
export const SPLINE_SCENE_URL = ''

export default function HeroScene() {
  if (SPLINE_SCENE_URL) {
    return (
      <iframe
        className="spline-scene"
        title="Interactive EventHub trophy"
        src={SPLINE_SCENE_URL}
      />
    )
  }

  return (
    <div className="scene-fallback" aria-label="Rotating neon trophy placeholder">
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      <div className="trophy">
        <i className="crown">✦</i>
        <i className="cup" />
        <i className="stem" />
        <i className="base" />
      </div>

      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />

      <p className="scene-label">
        Interactive 3D experience
        <br />
        <span>Connect your Spline scene</span>
      </p>
    </div>
  )
}