import { NewItem } from '@pages/constructor'
import { Input, Textarea } from '@shared/components'
import { Typography } from '@shared/components'
import { ImageComponent } from '@shared/components'

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
      layout: (
        <div className={s.newTextFields}>
          <Input placeholder="Enter title" />
          <Textarea placeholder="Enter description" />
        </div>
      ),
    }
    setNewItem(newItem)
  }

  const addNewItemVideo = () => {
    const newItem: NewItem = {
      type: 'video',
      layout: <div className={s.newTextFields}>Hello Video</div>,
    }
    setNewItem(newItem)
  }

  const addNewItemImage = () => {
    const newItem: NewItem = {
      type: 'image',
      layout: <ImageComponent src="/img/car.png" />,
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
