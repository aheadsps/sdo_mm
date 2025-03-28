import { CloseIcon } from '@assets/icons'
import clsx from 'clsx'
import { ReactNode } from 'react'
import ReactDOM from 'react-dom'

import { Typography } from '../typography'

import s from './offcanvas.module.scss'

type Props = {
  isOpen: boolean
  close: () => void
  title: string
  children: ReactNode
}

export const Offcanvas = ({ isOpen, close, title, children }: Props) => {
  const mainElement = document.querySelector('main')

  if (!mainElement) return null

  return ReactDOM.createPortal(
    <div className={clsx(s.offcanvasContainer, isOpen && s.offcanvasContainerVisible)}>
      <div className={s.offcanvas}>
        <div className={s.offcanvasTitle}>
          <Typography variant="header_6">{title}</Typography>
          <CloseIcon height={'8px'} width={'8px'} className={s.closeIcon} onClick={close} />
        </div>
        {children}
      </div>
    </div>,
    mainElement
  )
}
