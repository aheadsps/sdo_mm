import clsx from 'clsx'
import { ReactNode } from 'react'
import ReactDOM from 'react-dom'

import { Typography } from '../typography'

import s from './offcanvas.module.scss'

import { CloseIcon } from '@/assets/icons'

type Props = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  title: string
  children: ReactNode
}

export const Offcanvas = ({ isOpen, setIsOpen, title, children }: Props) => {
  const mainElement = document.querySelector('main')

  if (!mainElement) return null

  const onClick = () => {
    setIsOpen(false)
  }

  return ReactDOM.createPortal(
    <div className={clsx(s.offcanvasContainer, isOpen && s.offcanvasContainerVisible)}>
      <div className={s.offcanvas}>
        <div className={s.offcanvasTitle}>
          <Typography variant="header_6">{title}</Typography>
          <CloseIcon height={'8px'} width={'8px'} className={s.closeIcon} onClick={onClick} />
        </div>
        {children}
      </div>
    </div>,
    mainElement
  )
}
