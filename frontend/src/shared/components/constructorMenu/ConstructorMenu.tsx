import { Typography } from '../typography'

import { AddCard } from './addCard/AddCard'
import s from './constructorMenu.module.scss'
import { addTest } from './data'

export const CMenu = () => {
  return (
    <div className={s.container}>
      <div className={s.block}>
        <Typography variant="caption" children={'Теоретический материал'} className={s.title} />
        <AddCard children={'Добавить текст'} />
        <AddCard children={'Добавить видео'} />
        <AddCard children={'Добавить изображение'} />
      </div>
      <div className={s.block}>
        <Typography
          variant="caption"
          children={'Интерактивные задания (добавить тест)'}
          className={s.title}
        />
        {addTest.map((test) => {
          return <AddCard children={test.title} key={test.id} />
        })}
      </div>
      <div className={s.block}>
        <Typography variant="caption" children={'Структура курса'} className={s.title} />
        <AddCard children={'Добавить модуль'} />
      </div>
    </div>
  )
}
