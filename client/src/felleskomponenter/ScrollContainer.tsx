import classes from './ScrollContainer.module.css'

export function ScrollContainer(props: { children: React.ReactNode }) {
  const { children } = props
  return <div className={classes.container}>{children}</div>
}
