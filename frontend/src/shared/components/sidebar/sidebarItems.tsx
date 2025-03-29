import {
  MainIcon,
  LibraryIcon,
  StudyIcon,
  NewsIcon,
  WebinarAndSupportIcon,
  SettingsEyeIcon,
  WebinarIcon,
} from '@assets/icons'

export const sidebarItems = [
  {
    id: 'main',
    icon: <MainIcon width={24} height={24} />,
    text: 'Главное',
    path: '/main',
  },
  {
    id: 'my-learning',
    icon: <StudyIcon width={24} height={24} />,
    text: 'Мое обучение',
    path: '/learning',
  },
  {
    id: 'knowledge-library',
    icon: <LibraryIcon width={24} height={24} />,
    text: 'Библиотека знаний',
    path: '/library',
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
    id: 'support',
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