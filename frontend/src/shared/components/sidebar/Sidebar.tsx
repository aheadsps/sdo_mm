import { SidebarItem } from './sidebar-item/SidebarItem'
import s from './sidebar.module.scss'
import { sidebarItems } from './sidebarItems'
import { UserInfo } from './user-info/UserInfro'

export const Sidebar = () => {
  return (
    <aside className={s.sidebar}>
      <div className={s.sidebarContent}>
        <div className={s.fixedContainer}>
          <div>
            {sidebarItems.map((item) => (
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
