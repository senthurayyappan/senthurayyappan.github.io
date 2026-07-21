export function ImageContourFilters() {
  return (
    <svg className="image-contour-filter-defs" aria-hidden="true" focusable="false">
      <defs>
        <filter id="panel-contour-coarse" x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="softened" />
          <feColorMatrix
            in="softened"
            type="matrix"
            values=".333 .333 .333 0 0  .333 .333 .333 0 0  .333 .333 .333 0 0  0 0 0 1 0"
            result="gray"
          />
          <feConvolveMatrix
            in="gray"
            order="3"
            kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1"
            preserveAlpha="false"
            result="edges"
          />
          <feMorphology in="edges" operator="dilate" radius="0.65" result="ink" />
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.025" numOctaves="2" seed="19" result="paper" />
          <feDisplacementMap in="ink" in2="paper" scale="1.6" xChannelSelector="R" yChannelSelector="G" result="wobbled" />
          <feColorMatrix
            in="wobbled"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  .333 .333 .333 0 -.16"
          />
        </filter>

        <filter id="panel-contour-fine" x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.05" result="softened" />
          <feColorMatrix
            in="softened"
            type="matrix"
            values=".333 .333 .333 0 0  .333 .333 .333 0 0  .333 .333 .333 0 0  0 0 0 1 0"
            result="gray"
          />
          <feConvolveMatrix
            in="gray"
            order="3"
            kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1"
            preserveAlpha="false"
            result="edges"
          />
          <feMorphology in="edges" operator="dilate" radius="0.35" result="ink" />
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.038" numOctaves="2" seed="7" result="paper" />
          <feDisplacementMap in="ink" in2="paper" scale="0.9" xChannelSelector="R" yChannelSelector="G" result="wobbled" />
          <feColorMatrix
            in="wobbled"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  .333 .333 .333 0 -.24"
          />
        </filter>
      </defs>
    </svg>
  )
}
