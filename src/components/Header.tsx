import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-line bg-canvas">
      <div className="container-main flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className="h-[9px] w-[9px] rounded-full bg-accent"
            aria-hidden
          />
          <span className="font-en text-[15px] font-semibold tracking-tight text-ink">
            Buzz Style
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-ink-soft transition-colors hover:text-accent-ink"
          >
            型一覧
          </Link>
          <Link
            href="/about"
            className="text-sm text-ink-soft transition-colors hover:text-accent-ink"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
