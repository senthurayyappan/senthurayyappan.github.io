// Sikku-kolam ornament: a single closed line woven around a 3×3 dot grid.
// Each cell is a diamond (square rotated 45°) whose 4 sides are either
// straight or arc outward; combined, they read as the classic Tamil
// dot-grid kolam line.

type Bulges = string // subset of "n e s w"

function diamondPath(cx: number, cy: number, r: number, bulges: Bulges) {
  const flags = ['n', 'e', 's', 'w'].map((c) => bulges.includes(c))
  const [bN, bE, bS, bW] = flags
  const N: [number, number] = [cx, cy - r]
  const E: [number, number] = [cx + r, cy]
  const S: [number, number] = [cx, cy + r]
  const W: [number, number] = [cx - r, cy]
  const arc = r
  const seg = (end: [number, number], isArc: boolean) =>
    isArc
      ? `A ${arc} ${arc} 0 0 0 ${end[0]} ${end[1]} `
      : `L ${end[0]} ${end[1]} `

  let p = `M ${N[0]} ${N[1]} `
  p += seg(E, bN || bE)
  p += seg(S, bE || bS)
  p += seg(W, bS || bW)
  p += seg(N, bW || bN)
  return p + 'Z'
}

const cells: { col: number; row: number; bulges: Bulges }[] = [
  { col: 0, row: 0, bulges: 'nw' },
  { col: 1, row: 0, bulges: 'n' },
  { col: 2, row: 0, bulges: 'ne' },
  { col: 0, row: 1, bulges: 'w' },
  { col: 2, row: 1, bulges: 'e' },
  { col: 0, row: 2, bulges: 'sw' },
  { col: 1, row: 2, bulges: 's' },
  { col: 2, row: 2, bulges: 'se' },
]

export default function Kolam({
  size = 64,
  strokeWidth = 1.6,
  showDots = true,
}: {
  size?: number
  strokeWidth?: number
  showDots?: boolean
}) {
  const r = 14
  const d = r * 2
  const cx0 = 50
  const cy0 = 50

  const dots: [number, number][] = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      dots.push([cx0 + (col - 1) * d, cy0 + (row - 1) * d])
    }
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ display: 'block', overflow: 'visible' }}
      aria-hidden="true"
    >
      {cells.map((c, i) => {
        const cx = cx0 + (c.col - 1) * d
        const cy = cy0 + (c.row - 1) * d
        return (
          <path
            key={i}
            d={diamondPath(cx, cy, r, c.bulges)}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )
      })}
      {showDots &&
        dots.map(([x, y], i) => (
          <rect
            key={`d-${i}`}
            x={x - 1.6}
            y={y - 1.6}
            width="3.2"
            height="3.2"
            transform={`rotate(45 ${x} ${y})`}
            fill="currentColor"
          />
        ))}
    </svg>
  )
}
