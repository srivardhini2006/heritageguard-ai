import { Menu, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import BrandMark from "../common/BrandMark";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-brand-border bg-brand-sidebar/90 px-4 py-3 backdrop-blur lg:hidden">
      <button
        onClick={onMenuClick}
        className="rounded-md p-1.5 text-brand-text-muted transition-colors hover:bg-brand-border/40 hover:text-brand-text-dark"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      <Link to="/" className="transition-opacity hover:opacity-90">
        <BrandMark size="sm" theme="light" />
      </Link>

      <Link
        to="/alerts"
        className="relative rounded-md p-2 text-brand-text-muted transition-colors hover:bg-brand-border/40 hover:text-brand-text-dark"
        aria-label="View alerts"
      >
        <Bell size={18} />
        <span className="absolute right-1.5 top-1.5 flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rust-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-rust-500" />
        </span>
      </Link>
    </header>
  );
}
