import { ReactNode } from 'react'

import { Button } from '../button'
import { Typography } from '../typography'

import s from './title.module.scss'

interface Props {
  txt: string
  btn1: string
  btn2: string
  fstBtn: () => void
  scndBtn: () => void
  children?: ReactNode
}
const Title = ({ txt, btn1, btn2, fstBtn, scndBtn }: Props) => {
  return (
    <div className={s.titleBlock}>
      <Typography variant="header_4" className={s.title}>
        {txt}
      </Typography>
      <div className={s.buttonsBlock}>
        <Button variant="secondary" className={s.button} onClick={fstBtn}>
          {btn1}
        </Button>
        <Button variant="primary" className={s.button} onClick={scndBtn}>
          {btn2}
        </Button>
      </div>
    </div>
  )
}

export default Title
