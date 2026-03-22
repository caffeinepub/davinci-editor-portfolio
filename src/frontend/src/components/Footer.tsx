export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";
  const url = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`;

  return (
    <footer
      className="py-8 px-6 border-t border-[#2d2d2d] text-center"
      style={{ background: "#1a1a1a" }}
    >
      <div className="max-w-7xl mx-auto space-y-2">
        <p className="text-xs" style={{ color: "#4a4a4a" }}>
          © {year} Alex Morgan. All rights reserved.
        </p>
        <p className="text-xs" style={{ color: "#3d3d3d" }}>
          Built with ♥ using{" "}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-colors"
            style={{ color: "var(--color-amber)" }}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
