export default function Footer() {
  return (
    <footer className="foot wrap">
      {/* The footer is a single wide, low-profile extruded key -- a "space bar"
          built from the same .xsheet/.xcell/.xcell-face primitives as every
          panel on the site, so it flips dark and carries the accent/blue side
          faces. It rests at a shallow 6px (half a content tile's hover depth)
          so it reads as a quiet footer, not a raised panel; the hover lift is
          suppressed in CSS because a footer is not interactive. */}
      <div className="xsheet foot-bar">
        <div className="xcell foot-key">
          <div className="xcell-face foot-key-face">
            <span className="foot-end">The End</span>
            <span className="foot-copy">
              © {new Date().getFullYear()} Senthur Ayyappan
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
