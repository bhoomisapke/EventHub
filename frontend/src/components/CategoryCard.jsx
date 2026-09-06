export default function CategoryCard({ event }) {
  return (
    <article className={`event-card ${event.color}`}>
      <div className="event-top">
        <span className="event-icon">{event.icon}</span>
        <span>{event.type}</span>
      </div>

      <h3>{event.title}</h3>

      <div className="event-info">
        <span>{event.date}</span>
        <span>{event.time}</span>
      </div>

      <p>⌖ {event.venue}</p>

      <button>
        View event <b>→</b>
      </button>
    </article>
  )
}