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

export const sidebarItemsStudent = [
  {
    id: 'main',
    icon: <MainIcon width={24} height={24} />,
    text: 'Главное',
    path: routes.main,
  },
  {
    id: 'my-learning',
    icon: <StudyIcon width={24} height={24} />,
    text: 'Мое обучение',
    path: routes.learning,
  },
  {
    id: 'knowledge-library',
    icon: <LibraryIcon width={24} height={24} />,
    text: 'Библиотека знаний',
    path: routes.tbd,
  },
  {
    id: 'news',
    icon: <NewsIcon width={24} height={24} />,
    text: 'Новости',
    path: routes.tbd,
  },
  {
    id: 'webinars',
    icon: <WebinarIcon width={24} height={24} />,
    text: 'Вебинары',
    path: routes.tbd,
  },
  {
    id: 'consultations',
    icon: <WebinarAndSupportIcon width={24} height={24} />,
    text: 'Поддержка',
    path: routes.tbd,
  },
  {
    id: 'settings',
    icon: <SettingsEyeIcon width={24} height={24} />,
    text: 'Настройки',
    path: routes.tbd,
  },
]

export const sidebarItemsMethodologist = [
  {
    id: 'main',
    icon: <MainIcon width={24} height={24} />,
    text: 'Главная',
    path: routes.main,
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
  },
  {
    id: 'webinars',
    icon: <WebinarIcon width={24} height={24} />,
    text: 'Вебинары',
    path: routes.tbd,
  },
  {
    id: 'consultations',
    icon: <WebinarAndSupportIcon width={24} height={24} />,
    text: 'Консультации',
    path: routes.tbd,
  },
  {
    id: 'settings',
    icon: <SettingsEyeIcon width={24} height={24} />,
    text: 'Настройки',
    path: routes.tbd,
  },
  {
    id: 'support',
    icon: <SupportIcon width={24} height={24} />,
    text: 'Поддержка',
    path: routes.tbd,
  },
]
