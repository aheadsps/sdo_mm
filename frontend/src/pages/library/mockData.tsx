import Category from './Category'
import { Article } from './types'

export const articles: Article[] = [
  {
    id: 1,
    title: 'Как начать курс',
    category: Category.STUDY,
    date: '14.04.2025',
  },
  {
    id: 2,
    title: 'Где писать преподавателю',
    category: Category.SUPPORT,
    date: '04.02.2024',
  },
  {
    id: 3,
    title: 'Где смотреть расписание',
    category: Category.NAVIGATION,
    date: '24.01.2024',
  },
  {
    id: 4,
    title: 'Что делать, если...',
    category: Category.QUESTIONS,
    date: '22.01.2024',
  },
  {
    id: 5,
    title: 'У меня не воспроизводится видео',
    category: Category.SUPPORT,
    date: '13.10.2023',
  },
  {
    id: 6,
    title: 'Что значит доработка задания и что с этим делать',
    category: Category.STUDY,
    date: '15.09.2023',
  },
  {
    id: 7,
    title: 'Где взять сертификат',
    category: Category.QUESTIONS,
    date: '05.08.2023',
  },
]
