import { SidebarItem } from './sidebar-item/SidebarItem'
import s from './sidebar.module.scss'
import { sidebarItems } from './sidebarItems'

export const Sidebar = () => {
  return (
    <aside className={s.sidebar}>
      <div className={s.sidebarContent}>
        <div className={s.fixedContainer}>
          {sidebarItems.map((item) => (
            <SidebarItem key={item.id} text={item.text} path={item.path}>
              {item.icon}
            </SidebarItem>
          ))}
        </div>
      </div>
    </aside>
  )
}
