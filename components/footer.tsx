export default function Footer() {
  return (
    <footer className="foot wrap">
      {/* The footer is a single wide, low-profile extruded key -- a "space bar"
          built from the same .xsheet/.xcell/.xcell-face primitives as every
          panel on the site, so it flips dark and carries the accent/blue side
          faces. It rests raised (12px); the hover lift is suppressed in CSS
          because a footer is not interactive. */}
      <div className="xsheet foot-bar">
        <div className="xcell raised foot-key">
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
