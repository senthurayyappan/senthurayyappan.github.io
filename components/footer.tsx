import { KolamStrip } from './Kolam'

export default function Footer() {
  return (
    <footer className="foot wrap">
      <div className="foot-ornament">
        <KolamStrip count={19} altN={3} altSeed={5} />
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
