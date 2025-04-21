import {
  MainIcon,
  StudyIcon,
  LibraryIcon,
  NewsIcon,
  WebinarAndSupportIcon,
  WebinarIcon,
  SettingsEyeIcon,
  SupportIcon,
} from '@assets/icons'
import { routes } from '@routes/routes'
import { ReactNode } from 'react'

type SidebarItem = {
  id: string
  icon: ReactNode
  text: string
  path: string
  disabled?: boolean
}

export const sidebarItemsStudent: SidebarItem[] = [
  {
    id: 'main',
    icon: <MainIcon width={24} height={24} />,
    text: 'Главное',
    path: routes.main,
  },
  {
    id: 'my-learning',
    icon: <StudyIcon width={24} height={24} />,
    text: 'Курсы',
    path: routes.learning,
  },
  {
    id: 'knowledge-library',
    icon: <LibraryIcon width={24} height={24} />,
    text: 'База знаний',
    path: routes.library,
  },
  {
    id: 'news',
    icon: <NewsIcon width={24} height={24} />,
    text: 'Новости',
    path: routes.tbd,
    disabled: true,
  },
  {
    id: 'webinars',
    icon: <WebinarIcon width={24} height={24} />,
    text: 'Вебинары',
    path: routes.tbd,
    disabled: true,
  },
  {
    id: 'consultations',
    icon: <WebinarAndSupportIcon width={24} height={24} />,
    text: 'Поддержка',
    path: routes.tbd,
    disabled: true,
  },
  {
    id: 'settings',
    icon: <SettingsEyeIcon width={24} height={24} />,
    text: 'Настройки',
    path: routes.tbd,
    disabled: true,
  },
]

export const sidebarItemsMethodologist: SidebarItem[] = [
  {
    id: 'main',
    icon: <MainIcon width={24} height={24} />,
    text: 'Главная',
    path: routes.main,
    disabled: true,
  },
  {
    id: 'trainingCenter',
    icon: <StudyIcon width={24} height={24} />,
    text: 'Центр обучения',
    path: routes.trainingCenter,
  },
  {
    id: 'analytics',
    icon: <LibraryIcon width={24} height={24} />,
    text: 'Аналитика',
    path: routes.tbd,
    disabled: true,
  },
  {
    id: 'webinars',
    icon: <WebinarIcon width={24} height={24} />,
    text: 'Вебинары',
    path: routes.tbd,
    disabled: true,
  },
  {
    id: 'consultations',
    icon: <WebinarAndSupportIcon width={24} height={24} />,
    text: 'Консультации',
    path: routes.tbd,
    disabled: true,
  },
  {
    id: 'settings',
    icon: <SettingsEyeIcon width={24} height={24} />,
    text: 'Настройки',
    path: routes.tbd,
    disabled: true,
  },
  {
    id: 'support',
    icon: <SupportIcon width={24} height={24} />,
    text: 'Поддержка',
    path: routes.tbd,
    disabled: true,
  },
]
