import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

interface NavProps {
  onAdminClick: () => void;
}

export default function Nav({ onAdminClick }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: isAdmin } = useIsAdmin();
  const { identity } = useInternetIdentity();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Work", href: "#work" },
    { label: "Skills", href: "#skills" },
  ];

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#1a1a1a]/95 backdrop-blur-md border-b border-[#2d2d2d]"
          : "bg-[#1a1a1a] border-b border-[#2d2d2d]"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNavClick("#hero")}
          className="text-sm font-black tracking-[0.2em] uppercase hover:opacity-80 transition-opacity"
          style={{ color: "var(--color-amber)" }}
          data-ocid="nav.link"
        >
          LUFFY
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => handleNavClick(link.href)}
              className="text-sm font-medium text-[#e5e5e5] hover:text-[#f59e0b] transition-colors duration-200"
              data-ocid="nav.link"
            >
              {link.label}
            </button>
          ))}
          {identity && isAdmin && (
            <button
              type="button"
              onClick={onAdminClick}
              className="text-sm font-medium px-3 py-1 rounded border transition-all duration-200 hover:bg-[#f59e0b] hover:text-black"
              style={{
                borderColor: "var(--color-amber)",
                color: "var(--color-amber)",
              }}
              data-ocid="nav.open_modal_button"
            >
              Admin
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden text-[#e5e5e5] p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          data-ocid="nav.toggle"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1a1a1a] border-t border-[#2d2d2d] px-6 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => handleNavClick(link.href)}
              className="text-sm font-medium text-left text-[#e5e5e5] hover:text-[#f59e0b] py-1 transition-colors duration-200"
              data-ocid="nav.link"
            >
              {link.label}
            </button>
          ))}
          {identity && isAdmin && (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onAdminClick();
              }}
              className="text-sm font-medium text-left py-1"
              style={{ color: "var(--color-amber)" }}
              data-ocid="nav.open_modal_button"
            >
              Admin Panel
            </button>
          )}
        </div>
      )}
    </header>
  );
}
