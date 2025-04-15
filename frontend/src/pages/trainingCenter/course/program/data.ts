export type LessonType = {
  id: number
  title: string
  dateTime: string
  format: string
  expanded: boolean
}

export const optionsFormat = [
  {
    id: 1,
    value: 'Онлайн',
  },
  {
    id: 2,
    value: 'Оффлайн',
  },
]

export const optionsAccess = [
  {
    id: 1,
    value: 'Свободный доступ',
  },
  {
    id: 2,
    value: 'Линейное открытие',
  },
]

export const lessonsData: LessonType[] = [
  {
    id: 1,
    title: 'Введение в безопасность: основные риски при работе с электроинструментом',
    dateTime: '07.06.2025, 12:47',
    format: 'Онлайн',
    expanded: false,
  },
  {
    id: 2,
    title: 'Средства индивидуальной защиты: как минимизировать травмы',
    dateTime: '10.06.2025, 03:05',
    format: 'Онлайн',
    expanded: false,
  },
]
