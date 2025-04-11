import { NewItem } from '@pages/constructor'
import { Typography } from '@shared/components'

import { ConstructorContent } from '../constructorContent'

import { AddCard } from './addCard/AddCard'
import { AddTest } from './addTest/AddTest'
import s from './constructorMenu.module.scss'

type Props = {
  setNewItem: (newItem: NewItem) => void
}

export const CMenu = ({ setNewItem }: Props) => {
  const addNewItemText = () => {
    const newItem: NewItem = {
      type: 'text',
      layout: <ConstructorContent type="text" />,
    }
    setNewItem(newItem)
  }

  const addNewItemVideo = () => {
    const newItem: NewItem = {
      type: 'video',
      layout: <ConstructorContent type="video" />,
    }
    setNewItem(newItem)
  }

  const addNewItemImage = () => {
    const newItem: NewItem = {
      type: 'image',
      layout: <ConstructorContent type="image" />,
    }
    setNewItem(newItem)
  }

  const addNewItemITest = () => {
    const newItem: NewItem = {
      type: 'test',
      layout: <AddTest />,
    }
    setNewItem(newItem)
  }

  return (
    <aside className={s.container}>
      <div className={s.block}>
        <Typography variant="caption" className={s.title}>
          Теоретический материал
        </Typography>
        <AddCard children={'Добавить текст'} onClick={addNewItemText} />
        <AddCard children={'Добавить видео'} onClick={addNewItemVideo} />
        <AddCard children={'Добавить изображение'} onClick={addNewItemImage} />
      </div>

      <div className={s.block}>
        <Typography variant="caption" className={s.title}>
          Интерактивные задания (добавить тест)
        </Typography>
        <AddCard children={'Добавить тест'} onClick={addNewItemITest} />
      </div>

      <div className={s.block}>
        <Typography variant="caption" className={s.title}>
          Структура курса
        </Typography>
        <AddCard children={'Добавить модуль'} />
      </div>
    </aside>
  )
}
