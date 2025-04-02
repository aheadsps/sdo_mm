import { ReactNode } from 'react'
import ReactDOM from 'react-dom'

import { CloseIcon } from '@assets/icons'

import { Typography } from '../typography'

import s from './modal.module.scss'
type Props = {
  close: () => void
  title: string
  children: ReactNode
}

export const Modal = ({ close, title, children }: Props) => {
  const mainElement = document.querySelector('main')

  if (!mainElement) return null

  return ReactDOM.createPortal(
    <div className={s.modalContainer}>
      <div className={s.modal}>
        <Typography variant="header_6" className={s.modalTitle}>
          {title}
        </Typography>
        <CloseIcon height={'8px'} width={'8px'} onClick={close} className={s.closeIcon} />
        {children}
      </div>
    </div>,
    mainElement
  )
}
