import Format from './Format'
import { ScheduleData } from './Schedule'

export const scheduleData: ScheduleData = {
  events: [
    {
      id: 1,
      day: 'Понедельник',
      date: '21 апреля, 2025',
      lessons: [
        {
          id: 1,
          title: 'Вебинар «Введение в курс „Первая помощь”»',
          format: Format.FILLTIME,
          time: '12:00',
        },
        {
          id: 2,
          title: 'Урок «Первая помощь»',
          format: Format.ONLINE,
          time: '12:00',
        },
      ],
    },
    {
      id: 2,
      day: 'Вторник',
      date: '22 апреля, 2025',
      lessons: [
        {
          id: 1,
          title: 'Практика «Первая помощь»',
          format: Format.FILLTIME,
          time: '14:00 – 18:00',
        },
      ],
    },
    {
      id: 3,
      day: 'Пятница',
      date: '25 апреля, 2025',
      lessons: [
        {
          id: 1,
          title: 'Практика «Первая помощь»',
          format: Format.FILLTIME,
          time: '09:00 – 14:00',
        },
        {
          id: 2,
          title: 'Урок «Оказание первой помощи при потере сознания и обмороке»',
          format: Format.ONLINE,
          time: '16:00',
        },
        {
          id: 3,
          title: 'Урок «Остановка кровотечений и обработка ран»',
          format: Format.ONLINE,
          time: '19:00',
        },
      ],
    },
  ],
}
