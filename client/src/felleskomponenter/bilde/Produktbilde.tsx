import classes from './Produktbilde.module.css'

export function Produktbilde({
  src,
  alt,
  size = 'medium',
}: {
  src: string | undefined
  alt: string
  size?: 'small' | 'medium'
}) {
  if (!src) {
    return null
  }

  return (
    <div>
      <img alt={alt} src={src} className={size === 'small' ? classes.small : classes.medium} />
    </div>
  )
}
