import { Typography } from '@shared/components'
import clsx from 'clsx'
import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

import s from './sidebar-item.module.scss'

type Props = {
  children: ReactNode
  text: string
  path: string
}
export const SidebarItem = ({ children, path, text }: Props) => {
  return (
    <NavLink to={path} className={({ isActive }) => clsx(s.sidebarItemLink, isActive && s.active)}>
      {children}
      <Typography variant={'body_1'}>{text}</Typography>
    </NavLink>
  )
}