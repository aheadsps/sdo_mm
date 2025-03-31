import { CourseCard } from '@shared/components/courseCard'
import { Search } from '@shared/components/search'
import Title from '@shared/components/title/Title'

import s from './trainingCenter.module.scss'

const TrainingCenter = () => {
  const txt = 'Центр обучения'
  const btn1 = 'Создать тест'
  const btn2 = 'Создать курс'
  return (
    <div className={s.container}>
      <Title txt={txt} btn1={btn1} btn2={btn2} />
      <Search />
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

export default TrainingCenter
