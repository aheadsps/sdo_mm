import clsx from 'clsx'
import { ReactNode } from 'react'

import { Button } from '../button'
import { Typography } from '../typography'

import s from './title.module.scss'

interface Props {
  txt: string
  btn0?: string | ReactNode
  btn1: string | ReactNode
  btn2: string
  nullBtn?: () => void
  fstBtn?: () => void
  scndBtn?: () => void
  children?: ReactNode
  className?: string
  disabled?: boolean
  disabledAi?: boolean
  isIconAi?: boolean
}
export const Title = ({
  txt,
  btn0,
  btn1,
  btn2,
  nullBtn,
  fstBtn,
  scndBtn,
  className,
  disabled,
  disabledAi,
  isIconAi,
}: Props) => {
  return (
    <div className={s.titleBlock}>
      <Typography variant="header_4" className={s.title}>
        {txt}
      </Typography>
      <div className={s.buttonsBlock}>
        <Button
          variant="secondary"
          className={clsx(s.hidden, className)}
          onClick={nullBtn}
          disabled={disabled}
        >
          {btn0}
        </Button>
        <Button
          variant="secondary"
          className={s.button}
          onClick={fstBtn}
          disabled={disabledAi}
          isIcon={isIconAi}
          border={false}
        >
          {btn1}
        </Button>
        <Button variant="primary" className={s.button} onClick={scndBtn} disabled={disabled} isIcon>
          {btn2}
        </Button>
      </div>
    </div>
  )
}
