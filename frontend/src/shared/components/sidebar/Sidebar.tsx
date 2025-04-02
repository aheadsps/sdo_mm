import clsx from 'clsx'

import { SidebarItem } from './sidebar-item/SidebarItem'
import s from './sidebar.module.scss'
import { sidebarItemsMethodologist, sidebarItemsStudent } from './sidebarItems'
import { UserInfo } from './user-info/UserInfro'

type Props = {
  className?: string
}
export const Sidebar = ({ className }: Props) => {
  const data = sidebarItemsStudent
  // sidebarItemsStudent
  // sidebarItemsMethodologist
  return (
    <aside className={clsx(s.sidebar, className)}>
      <div className={s.sidebarContent}>
        <div className={s.container}>
          <div>
            {data.map((item) => (
              <SidebarItem key={item.id} text={item.text} path={item.path}>
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
