// Sikku-kolam generator, after Bárbara Almeida's Processing sketch
// (ported to p5 as vcidst/kolam): a checkerboard of tiles, each drawn as a
// rounded rect whose corner radii are 0 or half the tile. A fully-rounded
// corner meets its diagonal neighbour's arc in a smooth S-curve; a square
// corner meets it in an X crossing — together they read as the woven
// single-line sikku kolam. A 0/1 matrix on the tile corners drives the
// whole pattern; dots (pulli) sit in every enclosed cell.
//
// The unit is a RADIALLY SYMMETRIC medallion, like a real kolam: each corner
// value is stamped onto its whole dihedral (D4) orbit — 4 rotations × mirror.
// The medallion side n must be ODD so the drawn checkerboard maps onto
// itself under 90° rotation. The footer frieze is a row of such medallions.
// Enclosed loops are filled from the poster palette by shape: the number of
// rounded corners (0–4) indexes the colour, so colouring follows the symmetry.

const T = 20 // tile size in viewBox units
const H = T / 2

// count of rounded corners (0..4) -> fill; crossings (0) stay paper.
// Two-tone from the logo's palette: teardrops/commas in the accent,
// rounder shapes in teal.
const SHAPE_FILLS: (string | null)[] = [
  null,
  null,
  'var(--teal)',
  'var(--accent)',
  'var(--teal)',
]

// ponytail: mulberry32 — deterministic seeds so the build is reproducible
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// D4-symmetric (n+1)×(n+1) corner-link matrix for an n×n medallion, borders
// forced to 1 so the outer loops turn smoothly. p is the probability of a
// rounded corner — lower p means more crossings and longer woven runs.
function genD4(n: number, seed: number, p: number) {
  const L = n + 1
  const rand = mulberry32(seed)
  const m: number[][] = []
  for (let j = 0; j < L; j++) m.push(new Array(L).fill(1))
  for (let j = 1; j <= n / 2; j++) {
    for (let i = 1; i <= j; i++) {
      const l = rand() < p ? 1 : 0
      const orbit = [
        [i, j], [j, i],
        [L - 1 - i, j], [j, L - 1 - i],
        [i, L - 1 - j], [L - 1 - j, i],
        [L - 1 - i, L - 1 - j], [L - 1 - j, L - 1 - i],
      ]
      for (const [a, b] of orbit) m[b][a] = l
    }
  }
  return m
}

// Kolam rule (see e.g. the kolam drawing rules catalogued in the L-system
// literature: lines curve smoothly around dots, arcs adjoin every dot):
// a drawn loop with zero rounded corners is a plain orthogonal square, which
// never appears in real kolams. Reject those matrices and re-roll the seed
// deterministically until every loop carries at least one arc.
function valid(m: number[][], n: number) {
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      if ((i + j) % 2 !== 0) continue
      if (m[j][i] + m[j][i + 1] + m[j + 1][i + 1] + m[j + 1][i] === 0)
        return false
    }
  }
  return true
}

function buildD4(n: number, seed: number, p: number) {
  for (let k = 0; k < 50; k++) {
    const m = genD4(n, seed + k * 1000, p)
    if (valid(m, n)) return m
  }
  return genD4(n, seed, p)
}

function tilePath(x: number, y: number, [tl, tr, br, bl]: number[]) {
  const a = (r: number, ex: number, ey: number) =>
    r > 0 ? `A ${r} ${r} 0 0 1 ${ex} ${ey} ` : ''
  return (
    `M ${x + tl} ${y} L ${x + T - tr} ${y} ` +
    a(tr, x + T, y + tr) +
    `L ${x + T} ${y + T - br} ` +
    a(br, x + T - br, y + T) +
    `L ${x + bl} ${y + T} ` +
    a(bl, x, y + T - bl) +
    `L ${x} ${y + tl} ` +
    a(tl, x + tl, y) +
    'Z '
  )
}

// Render one medallion at a tile offset; returns SVG fragments.
function medallion(n: number, seed: number, p: number, ox: number, oy: number) {
  const m = buildD4(n, seed, p)
  const fills: { d: string; fill: string }[] = []
  let lines = ''
  const dots: [number, number][] = []
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const x = (ox + i) * T
      const y = (oy + j) * T
      const drawn = (i + j) % 2 === 0
      if (drawn) {
        const c = [m[j][i], m[j][i + 1], m[j + 1][i + 1], m[j + 1][i]]
        const d = tilePath(x, y, c.map((v) => v * H))
        const fill = SHAPE_FILLS[c[0] + c[1] + c[2] + c[3]]
        if (fill) fills.push({ d, fill })
        lines += d
      }
      // pulli sit in every enclosed cell: the drawn loops and the
      // interior gaps the weave fences in
      if (drawn || (j > 0 && j < n - 1 && i > 0 && i < n - 1)) {
        dots.push([x + H, y + H])
      }
    }
  }
  return { fills, lines, dots }
}

function KolamSvg({
  medallions,
  widthTiles,
  heightTiles,
  strokeWidth,
  ...svgProps
}: {
  medallions: ReturnType<typeof medallion>[]
  widthTiles: number
  heightTiles: number
  strokeWidth: number
} & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox={`0 0 ${widthTiles * T} ${heightTiles * T}`}
      aria-hidden="true"
      {...svgProps}
    >
      {medallions.flatMap((med, k) =>
        med.fills.map((f, i) => (
          <path
            key={`${k}-${i}`}
            d={f.d}
            fill={f.fill}
            stroke="none"
          />
        ))
      )}
      <path
        d={medallions.map((med) => med.lines).join('')}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {medallions.flatMap((med, k) =>
        med.dots.map(([x, y], i) => (
          <rect
            key={`${k}-${i}`}
            x={x - 1.5}
            y={y - 1.5}
            width="3"
            height="3"
            transform={`rotate(45 ${x} ${y})`}
            fill="currentColor"
          />
        ))
      )}
    </svg>
  )
}

// Single medallion — small standalone mark (n×n tiles, n odd).
export default function Kolam({
  size = 64,
  n = 5,
  seed = 13,
  p = 0.5,
  strokeWidth = 1.6,
}: {
  size?: number
  n?: number
  seed?: number
  p?: number
  strokeWidth?: number
}) {
  return (
    <KolamSvg
      medallions={[medallion(n, seed, p, 0, 0)]}
      widthTiles={n}
      heightTiles={n}
      strokeWidth={strokeWidth}
      width={size}
      height={size}
      style={{ display: 'block', overflow: 'visible' }}
    />
  )
}

// Braid — the diagonal "kambi" weave: every dot wears a diamond whose sides
// are either straight (45° lines that fuse with the neighbours' into long
// weaving diagonals, crossing at the midpoints between dots) or arcs bulging
// around the dot. Boundary-facing sides are forced to arc so the thread
// turns smoothly at the edges; the matrix is mirrored in x. Diamonds are
// filled from SHAPE_FILLS by arc count, like the tile model.
export function KolamBraid({
  cols = 38,
  rows = 2,
  seed = 3,
  p = 0.18,
  strokeWidth = 1.7,
}: {
  cols?: number
  rows?: number
  seed?: number
  p?: number
  strokeWidth?: number
}) {
  const rand = mulberry32(seed)
  const states: boolean[][][] = []
  for (let j = 0; j < rows; j++) {
    states.push(new Array(cols).fill(null))
  }
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < Math.ceil(cols / 2); i++) {
      // sides [ne, se, sw, nw]
      const s = [rand() < p, rand() < p, rand() < p, rand() < p]
      if (j === 0) { s[3] = true; s[0] = true }
      if (j === rows - 1) { s[1] = true; s[2] = true }
      if (i === 0) { s[2] = true; s[3] = true }
      states[j][i] = s
      const m = [s[3], s[2], s[1], s[0]]
      if (j === 0) { m[3] = true; m[0] = true }
      if (j === rows - 1) { m[1] = true; m[2] = true }
      if (cols - 1 - i === cols - 1) { m[0] = true; m[1] = true }
      states[j][cols - 1 - i] = m
    }
  }

  const R = H
  const diamond = (cx: number, cy: number, [ne, se, sw, nw]: boolean[]) => {
    const pts: [number, number][] = [
      [cx + R, cy], // E
      [cx, cy + R], // S
      [cx - R, cy], // W
      [cx, cy - R], // N
    ]
    const seg = (pt: [number, number], isArc: boolean) =>
      isArc ? `A ${R} ${R} 0 0 0 ${pt[0]} ${pt[1]} ` : `L ${pt[0]} ${pt[1]} `
    return (
      `M ${cx} ${cy - R} ` +
      seg(pts[0], ne) +
      seg(pts[1], se) +
      seg(pts[2], sw) +
      seg(pts[3], nw) +
      'Z '
    )
  }

  const fills: { d: string; fill: string }[] = []
  let lines = ''
  const dots: [number, number][] = []
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const cx = R + i * T
      const cy = R + j * T
      const s = states[j][i]
      const d = diamond(cx, cy, s)
      const fill = SHAPE_FILLS[s.filter(Boolean).length]
      if (fill) fills.push({ d, fill })
      lines += d
      dots.push([cx, cy])
    }
  }

  return (
    <svg
      viewBox={`0 0 ${cols * T} ${rows * T}`}
      aria-hidden="true"
      style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}
    >
      {fills.map((f, i) => (
        <path key={i} d={f.d} fill={f.fill} stroke="none" />
      ))}
      <path
        d={lines}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {dots.map(([x, y], i) => (
        <rect
          key={i}
          x={x - 1.7}
          y={y - 1.7}
          width="3.4"
          height="3.4"
          transform={`rotate(45 ${x} ${y})`}
          fill="currentColor"
        />
      ))}
    </svg>
  )
}

// Frieze — medallions CHAINED with zero gap, the traditional way borders are
// built from small dot motifs: the pulli columns stay evenly spaced across
// the joins (seamless lattice) and the facing border arcs of neighbouring
// medallions meet in tangent kisses, so the border reads as one continuous
// chain. Pass altN/altSeed to alternate a second (smaller, vertically
// centred) motif — the big-motif/small-connector rhythm of vari borders.
// n=1 degenerates to the classic single-row circle chain.
export function KolamStrip({
  count = 18,
  n = 5,
  seed = 13,
  p = 0.5,
  altN,
  altSeed,
  strokeWidth = 1.6,
}: {
  count?: number
  n?: number
  seed?: number
  p?: number
  altN?: number
  altSeed?: number
  strokeWidth?: number
}) {
  const maxN = Math.max(n, altN ?? 0)
  const medallions: ReturnType<typeof medallion>[] = []
  let ox = 0
  for (let k = 0; k < count; k++) {
    const useAlt = altN !== undefined && k % 2 === 1
    const mn = useAlt ? altN : n
    const ms = useAlt ? altSeed ?? seed : seed
    medallions.push(medallion(mn, ms, p, ox, (maxN - mn) / 2))
    ox += mn
  }
  return (
    <KolamSvg
      medallions={medallions}
      widthTiles={ox}
      heightTiles={maxN}
      strokeWidth={strokeWidth}
      style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}
    />
  )
}
