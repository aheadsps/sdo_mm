import { selectUser } from '@services/slices'
import { useAppSelector } from '@services/store'
import clsx from 'clsx'

import { SidebarItem } from './sidebar-item/SidebarItem'
import s from './sidebar.module.scss'
import { Role } from './sidebar.types'
import { sidebarItemsStudent, sidebarItemsMethodologist } from './sidebarItems'
import { UserInfo } from './user-info/UserInfro'

type Props = {
  className?: string
}
export const Sidebar = ({ className }: Props) => {
  const user = useAppSelector(selectUser)

  const isStudent = user?.profession === Role.student
  const isMethodologist = user?.profession === Role.methodologist

  const data = isMethodologist ? sidebarItemsMethodologist : isStudent ? sidebarItemsStudent : []

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
          <UserInfo />
        </div>
      </div>
    </aside>
  )
}
