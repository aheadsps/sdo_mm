import { LockIcon } from '@assets/icons'
import clsx from 'clsx'
import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

import { Typography } from '../../typography'

import s from './sidebar-item.module.scss'

type Props = {
  children: ReactNode
  text: string
  path: string
  disabled?: boolean
}
export const SidebarItem = ({ children, path, text, disabled = false }: Props) => {
  if (disabled) {
    return (
      <div className={clsx(s.sidebarItemLink, s.disabledClass)}>
        <div className={s.disabledItem}>
          {children}
          <Typography variant={'body_1'}>{text}</Typography>
        </div>
        <LockIcon height={'12px'} width={'12px'} />
      </div>
    )
  }

  return (
    <NavLink to={path} className={({ isActive }) => clsx(s.sidebarItemLink, isActive && s.active)}>
      {children}
      <Typography variant={'body_1'}>{text}</Typography>
    </NavLink>
  )
}
