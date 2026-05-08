export default function Footer() {
  return (
    <footer className="foot wrap">
      <div className="foot-row">
        <span className="foot-end">
          The End
          <span className="ta">முற்றும்</span>
        </span>
        <span className="foot-copy">
          © {new Date().getFullYear()} Senthur Ayyappan
        </span>
      </div>
    </footer>
  )
}
