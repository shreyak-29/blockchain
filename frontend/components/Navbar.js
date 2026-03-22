import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-brand">
          🏠 BlockRegistry
        </Link>
        <ul className="navbar-links">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/register">Register Property</Link>
          </li>
          <li>
            <Link href="/transfer">Transfer Property</Link>
          </li>
          <li>
            <Link href="/view">Verify Property</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}