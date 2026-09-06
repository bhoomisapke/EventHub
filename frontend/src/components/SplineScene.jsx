// Replace this URL with your published Spline scene URL.
const SPLINE_SCENE_URL = 'https://my.spline.design/your-scene-name/scene.splinecode'

export default function SplineScene() {
  return (
    <div className="spline-wrapper">
      <iframe
        title="Interactive campus trophy"
        src={SPLINE_SCENE_URL}
        frameBorder="0"
        allowFullScreen
      />
    </div>
  )
}