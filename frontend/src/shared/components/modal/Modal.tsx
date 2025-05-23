import { CloseIcon } from '@assets/icons'
import { ReactNode } from 'react'
import ReactDOM from 'react-dom'

import { Typography, Variant } from '../typography'

import s from './modal.module.scss'
type Props = {
  close: () => void
  title: string
  children: ReactNode
  titleStyle: Variant
}

export const Modal = ({ close, title, children, titleStyle }: Props) => {
  const mainElement = document.querySelector('body')

  if (!mainElement) return null

  return ReactDOM.createPortal(
    <div className={s.modalContainer}>
      <div className={s.modal}>
        <div className={s.header}>
          <Typography variant={titleStyle} className={s.modalTitle}>
            {title}
          </Typography>
          <CloseIcon height={'8px'} width={'8px'} onClick={close} className={s.closeIcon} />
        </div>
        {children}
      </div>
    </div>,
    mainElement
  )
}
