import KolamPlait from './Kolam'

export default function Footer() {
  return (
    <footer className="foot wrap">
      <div className="foot-ornament">
        <KolamPlait segments={19} />
      </div>
      <div className="foot-row">
        <span className="foot-end">The End</span>
        <span className="foot-copy">
          © {new Date().getFullYear()} Senthur Ayyappan
        </span>
      </div>
    </footer>
  )
}
