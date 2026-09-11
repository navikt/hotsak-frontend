import classes from './Produktbilde.module.css'

export function Produktbilde({
  src,
  alt,
  size = 'medium',
}: {
  src: string | undefined
  alt: string
  size?: 'thumbnail' | 'small' | 'medium'
}) {
  if (!src) {
    return null
  }

  return (
    <div className={classes.border}>
      <img
        alt={alt}
        src={src}
        className={size === 'thumbnail' ? classes.thumbnail : size === 'small' ? classes.small : classes.medium}
      />
    </div>
  )
}
