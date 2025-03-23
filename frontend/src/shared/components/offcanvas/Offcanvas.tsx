import clsx from 'clsx'
import ReactDOM from 'react-dom'

import { CloseIcon } from '@assets/icons'

import { Typography } from '../typography'

import s from './offcanvas.module.scss'

type Props = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const Offcanvas = ({ isOpen, setIsOpen }: Props) => {
  const mainElement = document.querySelector('main')

  if (!mainElement) return null

  const onClick = () => {
    setIsOpen(false)
  }

  return ReactDOM.createPortal(
    <div className={clsx(s.offcanvasContainer, isOpen && s.offcanvasContainerVisible)}>
      <div className={s.offcanvas}>
        <div className={s.offcanvasTitle}>
          <Typography variant="header_6">Ваш персональный помощник</Typography>
          <CloseIcon height={'8px'} width={'8px'} className={s.closeIcon} onClick={onClick} />
        </div>
      </div>
    </div>,
    mainElement
  )
}
