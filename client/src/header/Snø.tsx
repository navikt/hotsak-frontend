import { type CSSProperties, useState } from 'react'

import classes from './Snø.module.css'

const ANTALL_SNØFNUGG = 50

export function Snø() {
  const [snøfnugg] = useState(() =>
    Array.from({ length: ANTALL_SNØFNUGG }, () => ({
      left: `${Math.random() * 100}%`,
      fontSize: `${0.6 + Math.random() * 0.9}rem`,
      animationDuration: `${8 + Math.random() * 10}s`,
      animationDelay: `${-Math.random() * 18}s`,
      opacity: 0.5 + Math.random() * 0.5,
    }))
  )

  return (
    <div className={classes.snø} aria-hidden="true">
      {snøfnugg.map((style: CSSProperties, index) => (
        <span key={index} className={classes.snøfnugg} style={style}>
          ❄
        </span>
      ))}
    </div>
  )
}
