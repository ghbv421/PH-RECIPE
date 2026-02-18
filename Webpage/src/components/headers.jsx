export default function Header() {
  return (
    <header className="top-header">

      <input
        className="search"
        placeholder="Search for recipes"
      />

      <div className="header-right">
        <span>🌐 English</span>
        <span>⚙</span>
        <span>👤 Juan Dela Cruz</span>
      </div>

    </header>
  );
}
