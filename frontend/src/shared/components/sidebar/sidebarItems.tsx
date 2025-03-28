import {
  MainIcon,
  StudyIcon,
  LibraryIcon,
  NewsIcon,
  WebinarAndSupportIcon,
  WebinarIcon,
  SettingsEyeIcon,
} from '@assets/icons'
import { routes } from '@routes/routes'

export const sidebarItems = [
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
    path: routes.news,
  },
  {
    id: 'webinars',
    icon: <WebinarIcon width={24} height={24} />,
    text: 'Вебинары',
    path: routes.home,
  },
  {
    id: 'support',
    icon: <WebinarAndSupportIcon width={24} height={24} />,
    text: 'Поддержка',
    path: routes.home,
  },
  {
    id: 'settings',
    icon: <SettingsEyeIcon width={24} height={24} />,
    text: 'Настройки',
    path: routes.home,
  },
]
