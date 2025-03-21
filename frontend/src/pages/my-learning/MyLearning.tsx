/* eslint-disable prettier/prettier */
import { Button } from '@shared/components'
import { LessonCard } from '@shared/components/lessonCard/LessonCard'
import { Tooltipe } from '@shared/components/tooltipe/Tooltipe'
import { withLayout } from '@shared/HOC/withLayout/withLayout'
import { useState } from 'react'

import s from './myLearning.module.scss'

const MyLearningComp: React.FC = () => {
  const [mode, setMode] = useState<string>('Назначенные курсы')
  const [isTooltipe, setIsTooltipe] = useState<boolean>(false)
  // const [isCount, setIsCount] = useState(3)

  const buttons = [
    'Назначенные курсы',
    'Просроченные курсы',
    'Избранные курсы',
    'Завершённые курсы',
  ]

  type Course = {
    id: string,
    name: string,
    discription: string,
    days: string,
    lessons: string,
    time: string,
    progress: string,
    // isFav: boolean,
  }
  type Lesson =  {
    id: string,
    name: string,
    discription: string,
    expired: boolean,
    days: string,
    lessons: string,
    time: string,
    progress: string,
    // isFav: boolean,
  }
  const courses: [Course] = [
    {
      id: '001',
      name: 'English Check-Up: База и первые шаги',
      discription:
        'Чувствуешь, что в английском чего‑то не хватает? Пройди этот курс и пойми, какие темы уже освоены, а где есть пробелы. Мы разберём твои ошибки и дадим персональные рекомендации, чтобы ты учил язык быстрее и увереннее.',
      days: '6 недель',
      lessons: '4 урока',
      time: '~120 минут',
      progress: '50%',
    },
    {
      id: '002',
      name: 'English Check-Up: Продвинутый разбор',
      discription:
        'Этот курс выявит слабые места: сложные времена, фразовые глаголы, нюансы словоупотребления. Ты получишь детальный разбор ошибок и советы, которые помогут говорить свободнее.',
      days: '4 дня',
      lessons: '6 уроков',
      time: '~200 минут',
      progress: '0%',
    },
  ]
  const lessons: [Lesson] = [
    {
      id: '368',
      name: 'Безопасность на рабочем месте: охрана труда в метрополитене',
      discription:
        'Этот курс поможет вам разобраться с основными правилами охраны труда в метрополитене. Вы узнаете о ключевых требованиях безопасности, инструкциях по предотвращению несчастных случаев и правильных действиях в экстренных ситуациях.',
      expired: true,
      days: '2 дня',
      lessons: '1 урок',
      time: '~50 минут',
      progress: '0%',
    },
    {
      id: '593',
      name: 'Безопасность при работе с электроинструментом',
      discription:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem explicabo dicta magnam neque modi officia!',
      expired: false,
      days: '2 дня',
      lessons: '1 урок',
      time: '~120 минут',
      progress: '10%',
    },
  ]
  return (
    <>
      {isTooltipe && <Tooltipe />}
      <main className={s.container}>
        <div className={s.container__headBox}>
          <div className={s.container__btnBox}>
            {buttons.map((btn, index) => {
              const count = index + 1
              return (
                <div className={s.container__boxbtn} key={index}>
                  <div className={s.container__counterBox}>
                    <p className={s.container__counter}>{count}</p>
                  </div>
                  <Button
                    className={s.container__btn}
                    children={btn}
                    variant={mode === btn ? 'primary' : 'secondary'}
                    onClick={() => setMode(btn)}
                  />
                </div>
              )
            })}
          </div>
          <Button
            children="ИИ"
            variant={mode === 'ИИ' ? 'primary' : 'secondary'}
            onClick={() => setMode('ИИ')}
          />
        </div>
        <div className={s.container__content}>
          {courses.map((course: {}) => {
            return <LessonCard course={course}/>
          })}
          {/* <LessonCard isFav={false} />
          <LessonCard isFav={true} /> */}
        </div>
        <div className={s.container__content}>
          <LessonCard isFav={true} />
          <LessonCard isFav={false} />
        </div>
      </main>
    </>
  )
}

export const MyLearning = withLayout(MyLearningComp)
