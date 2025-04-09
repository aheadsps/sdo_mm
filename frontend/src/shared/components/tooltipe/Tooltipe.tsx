import clsx from 'clsx'

import { CloseIcon, TooltipeCheckboxIcon } from '@assets/icons'

import s from './tooltipe.module.scss'

type Props = {
  time?: string
  txt: string
  className?: string
  close: () => void
}
export const Tooltipe = ({ time, txt, className, close }: Props) => {
  return (
    <div className={clsx(s.tooltipe, className)}>
      <div className={s.tooltipe__topBox}>
        <TooltipeCheckboxIcon />
        <div className={s.tooltipe__rightBox} onClick={close}>
          <p className={s.tooltipe__txt}>{time}</p>
          <CloseIcon />
        </div>
      </div>
      <div className={s.tooltipe__bottomBox}>{txt}</div>
    </div>
  )
}
