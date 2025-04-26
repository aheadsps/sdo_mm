import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { selectUser } from '@services/slices'
import { useAppSelector } from '@services/store'
import { handleError } from '@shared/utils'
import clsx from 'clsx'

import { Loader } from '../loader'
import { Typography } from '../typography'

import { SidebarItem } from './sidebar-item/SidebarItem'
import s from './sidebar.module.scss'
import { Role } from './sidebar.types'
import { sidebarItemsStudent, sidebarItemsMethodologist } from './sidebarItems'
import { UserInfo } from './user-info/UserInfro'

type Props = {
  className?: string
  isLoading?: boolean
  error?: FetchBaseQueryError | SerializedError
}
export const Sidebar = ({ className, isLoading, error }: Props) => {
  const user = useAppSelector(selectUser)

  const isStudent = user?.profession === Role.student
  const isMethodologist = user?.profession === Role.methodologist

  const data = isMethodologist ? sidebarItemsMethodologist : isStudent ? sidebarItemsStudent : []

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <Typography variant="body_1">{handleError(error)}</Typography>
  }

  return (
    <aside className={clsx(s.sidebar, className)}>
      <div className={s.sidebarContent}>
        <div className={s.container}>
          <div>
            {data.map((item) => (
              <SidebarItem key={item.id} text={item.text} path={item.path} disabled={item.disabled}>
                {item.icon}
              </SidebarItem>
            ))}
          </div>
          {user && <UserInfo profile={user} />}
        </div>
      </div>
    </aside>
  )
}
