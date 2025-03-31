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
        <div className={s.Card}>
          <h6 className={s.title}>English Check-Up: Продвинутый разбор</h6>
          <div className={s.content}></div>
          <div className={s.buttonBox}></div>
        </div>
      </div>
    </div>
  )
}

export default TrainingCenter
