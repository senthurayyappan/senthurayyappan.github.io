interface PostFigureProps {
  src: string
  alt: string
  position?: string
  caption?: string
}

export default function PostFigure({
  src,
  alt,
  position = 'center center',
  caption,
}: PostFigureProps) {
  return (
    <figure className="mb-8 overflow-hidden rounded-[4px]">
      <div
        role="img"
        aria-label={alt}
        className="w-full aspect-[16/9]"
        style={{
          backgroundImage: `url(${src})`,
          backgroundPosition: position,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {caption && (
        <figcaption
          className="mt-2 text-sm italic text-center text-[color:color-mix(in_srgb,var(--text)_60%,transparent)]"
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
