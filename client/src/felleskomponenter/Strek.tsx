import classes from './Strek.module.css'

export function Skillelinje({ color = 'default' }: { color?: 'default' | 'info' }) {
  return (
    <div>
      <Strek color={color} />
    </div>
  )
}

export function Strek({ color = 'default' }: { color?: 'default' | 'info' }) {
  return <hr className={color === 'info' ? classes.strekInfo : classes.strek} />
}
