import { ArrowLeftIcon } from '@assets/icons'
import clsx from 'clsx'
import { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { Typography } from '../typography'

import s from './back-to.page.module.scss'

type Props = {
  to?: string
  children: ReactNode
  className?: string
}

export const BackToPage = ({ children, to, className }: Props) => {
  const navigate = useNavigate()

  if (to) {
    return (
      <NavLink to={to} className={clsx(s.backToPage, className)}>
        <ArrowLeftIcon className={s.icon} />
        <Typography variant="body_2" className={s.backText}>
          {children}
        </Typography>
      </NavLink>
    )
  }

  return (
    <button onClick={() => navigate(-1)} className={clsx(s.backToPage, className)}>
      <ArrowLeftIcon className={s.icon} />
      <Typography variant="body_2" className={s.backText}>
        {children}
      </Typography>
    </button>
  )
}
