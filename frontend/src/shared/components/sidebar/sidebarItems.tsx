import {
  MainIcon,
  StudyIcon,
  LibraryIcon,
  NewsIcon,
  WebinarAndSupportIcon,
  WebinarIcon,
  SettingsEyeIcon,
  WebinarIcon,
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
    path: routes.library,
  },
  {
    id: 'news',
    icon: <NewsIcon width={24} height={24} />,
    text: 'Новости',
    path: '/news',
  },
  {
    id: 'webinars',
    icon: <WebinarIcon width={24} height={24} />,
    text: 'Вебинары',
    path: '/',
  },
  {
    id: 'consultations',
    icon: <WebinarAndSupportIcon width={24} height={24} />,
    text: 'Поддержка',
    path: '/',
  },
  {
    id: 'settings',
    icon: <SettingsEyeIcon width={24} height={24} />,
    text: 'Настройки',
    path: '/',
  },
]

export const sidebarItemsMethodologist = [
  {
    id: 'main',
    icon: <MainIcon width={24} height={24} />,
    text: 'Главная',
    path: '/main',
  },
  {
    id: 'trainingCenter',
    icon: <StudyIcon width={24} height={24} />,
    text: 'Центр обучения',
    path: '/trainingCenter',
  },
  {
    id: 'analytics',
    icon: <LibraryIcon width={24} height={24} />,
    text: 'Аналитика',
    path: '/',
  },
  {
    id: 'webinars',
    icon: <WebinarIcon width={24} height={24} />,
    text: 'Вебинары',
    path: '/',
  },
  {
    id: 'consultations',
    icon: <WebinarAndSupportIcon width={24} height={24} />,
    text: 'Консультации',
    path: '/',
  },
  {
    id: 'settings',
    icon: <SettingsEyeIcon width={24} height={24} />,
    text: 'Настройки',
    path: '/',
  },
  {
    id: 'support',
    icon: <SupportIcon width={24} height={24} />,
    text: 'Поддержка',
    path: '/',
  },
]
