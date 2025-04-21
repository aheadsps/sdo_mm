import { Course } from './types'

export const courses: Course[] = [
  {
    id: '001',
    isCourse: true,
    name: 'English Check-Up: База и первые шаги',
    src: '/img/svg/course-01.svg',
    description:
      'Чувствуешь, что в английском чего‑то не хватает? Пройди этот курс и пойми, какие темы уже освоены, а где есть пробелы. Мы разберём твои ошибки и дадим персональные рекомендации, чтобы ты учил язык быстрее и увереннее.',
    expired: false,
    days: '6 недель',
    lessons: '4 урока',
    time: '~120 минут',
    progress: '100%',
    status: 0,
  },
  {
    id: '002',
    isCourse: true,
    name: 'English Check-Up: Продвинутый разбор',
    src: '/img/svg/course-02.svg',
    description:
      'Этот курс выявит слабые места: сложные времена, фразовые глаголы, нюансы словоупотребления. Ты получишь детальный разбор ошибок и советы, которые помогут говорить свободнее.',
    expired: false,
    days: '4 дня',
    lessons: '6 уроков',
    time: '~200 минут',
    progress: '0%',
    status: 1,
  },
  {
    id: '368',
    isCourse: false,
    name: 'Безопасность на рабочем месте: охрана труда в метрополитене',
    src: '/img/svg/lesson-01.svg',
    description:
      'Этот курс поможет вам разобраться с основными правилами охраны труда в метрополитене. Вы узнаете о ключевых требованиях безопасности, инструкциях по предотвращению несчастных случаев и правильных действиях в экстренных ситуациях.',
    expired: true,
    days: '2 дня',
    lessons: '1 урок',
    time: '~50 минут',
    progress: '0%',
    status: 2,
  },
  {
    id: '593',
    isCourse: false,
    name: 'Безопасность при работе с электроинструментом',
    src: '/img/svg/lesson-02.svg',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem explicabo dicta magnam neque modi officia!',
    expired: false,
    days: '2 дня',
    lessons: '1 урок',
    time: '~120 минут',
    progress: '10%',
    status: 1,
  },
]
export const getCurrentCourses: (mode: number) => Course[] = (mode: number) => {
  if (mode === 1) return courses.filter((el) => el.expired === true)
  if (mode === 2) return courses.filter((el) => el.isCourse === true)
  if (mode === 3) return courses.filter((el) => el.progress === '100%')
  return courses
}
