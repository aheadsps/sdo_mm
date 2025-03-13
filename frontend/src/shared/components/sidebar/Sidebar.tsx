import {
  MainIcon,
  LibraryIcon,
  StudyIcon,
  NewsIcon,
  WebinarAndSupportIcon,
  SettingsEyeIcon,
} from '@assets/icons'

import { SidebarItem } from './sidebar-item/SidebarItem'
import s from './sidebar.module.scss'

export const Sidebar = () => {
  return (
    <aside className={s.sidebar}>
      <SidebarItem path="/main" text="Главное">
        <MainIcon width={24} height={24} />
      </SidebarItem>
      <SidebarItem path="/learning" text="Мое обучение">
        <StudyIcon width={24} height={24} />
      </SidebarItem>
      <SidebarItem path="/" text="Библиотека знаний">
        <LibraryIcon width={24} height={24} />
      </SidebarItem>
      <SidebarItem path="/" text="Новости">
        <NewsIcon width={24} height={24} />
      </SidebarItem>
      <SidebarItem path="/" text="Вебинары">
        <WebinarAndSupportIcon width={24} height={24} />
      </SidebarItem>
      <SidebarItem path="/" text="Настройки">
        <SettingsEyeIcon width={24} height={24} />
      </SidebarItem>
    </aside>
  )
}
