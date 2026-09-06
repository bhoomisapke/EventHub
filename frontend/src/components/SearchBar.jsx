export default function SearchBar() {
  return (
    <div className="search-bar">
      <span>⌕</span>

      <input
        aria-label="Search events"
        placeholder="Search events, clubs, or venues..."
      />

      <button>
        Search <b>→</b>
      </button>
    </div>
  )
}
