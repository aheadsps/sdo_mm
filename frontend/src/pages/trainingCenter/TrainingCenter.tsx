import { Title, CourseCard } from '@shared/components'
import { withLayout } from '@shared/HOC'

import { Filters } from './Filters'
import s from './trainingCenter.module.scss'

const txt = 'Центр обучения'
const btn1 = 'Создать тест'
const btn2 = 'Создать курс'

const Training = () => {
  return (
    <div className={s.container}>
      <Title txt={txt} btn1={btn1} btn2={btn2} />
      <Filters />
      <div className={s.cardsBlock}>
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
      </div>
    </div>
  )
}
export const TrainingCenter = withLayout(Training)
