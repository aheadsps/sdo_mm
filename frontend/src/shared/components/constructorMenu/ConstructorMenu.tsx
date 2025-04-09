import { NewItem } from '@pages/constructor'
import { Dispatch, SetStateAction } from 'react'

import { ImageComponent } from '../image'
import { Input, Textarea } from '../text-field'
import { Typography } from '../typography'

import { AddCard } from './addCard/AddCard'
import s from './constructorMenu.module.scss'
import { addTest } from './data'

type Props = {
  setNewItem: Dispatch<SetStateAction<NewItem[]>>
}
export const CMenu = ({ setNewItem }: Props) => {
  const addNewItemText = () => {
    setNewItem((prev) => [
      ...prev,
      {
        type: 'text',
        description: ['Hello', 'World'],
        layout: (
          <div className={s.newTextFields}>
            <Input placeholder="Enter title" />
            <Textarea placeholder="Enter description" />
          </div>
        ),
      },
    ])
  }

  const addNewItemVideo = () => {
    setNewItem((prev) => [
      ...prev,
      {
        type: 'video',
        layout: <div className={s.newTextFields}>Hello Video</div>,
      },
    ])
  }

  const addNewItemImage = () => {
    setNewItem((prev) => [
      ...prev,
      {
        type: 'image',
        layout: <ImageComponent src="/img/car.png" />,
      },
    ])
  }

  return (
    <aside className={s.container}>
      <div className={s.block}>
        <Typography variant="caption" children={'Теоретический материал'} className={s.title} />
        <AddCard children={'Добавить текст'} onClick={addNewItemText} />
        <AddCard children={'Добавить видео'} onClick={addNewItemVideo} />
        <AddCard children={'Добавить изображение'} onClick={addNewItemImage} />
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
    </aside>
  )
}
