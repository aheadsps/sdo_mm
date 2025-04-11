import { NewItem } from '@services/slices/constructor/constructor.types'
import { Typography } from '@shared/components'

import { ConstructorContent } from '../constructorContent'

import { AddCard } from './addCard/AddCard'
import { AddTest } from './addTest/AddTest'
import s from './constructorMenu.module.scss'

type Props = {
  setNewItem: (newItem: NewItem) => void
  activeBlockId: number
}

export const CMenu = ({ setNewItem, activeBlockId }: Props) => {
  const addNewItemText = () => {
    const newItem: NewItem = {
      type: 'text',
      layout: <ConstructorContent type="text" />,
      id: activeBlockId,
    }
    setNewItem(newItem)
  }

  const addNewItemVideo = () => {
    const newItem: NewItem = {
      type: 'video',
      layout: <ConstructorContent type="video" />,
      id: activeBlockId,
    }
    setNewItem(newItem)
  }

  const addNewItemImage = () => {
    const newItem: NewItem = {
      type: 'image',
      layout: <ConstructorContent type="image" />,
      id: activeBlockId,
    }
    setNewItem(newItem)
  }

  const addNewItemITest = () => {
    const newItem: NewItem = {
      type: 'test',
      layout: <AddTest />,
      id: activeBlockId,
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
