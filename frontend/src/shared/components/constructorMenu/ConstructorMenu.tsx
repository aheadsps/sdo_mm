import { Step } from '@services/api'
import { AddedMaterial, NewItem } from '@services/slices/constructor/constructor.types'
import { addNewBlock, setActiveBlockId } from '@services/slices/constructor/constructorSlice'
import { useAppDispatch } from '@services/store'
import { Typography } from '@shared/components'
import clsx from 'clsx'
import { useState } from 'react'

import { AddCard } from './addCard/AddCard'
import s from './constructorMenu.module.scss'

type Props = {
  setNewItem: (newItem: NewItem) => void
  isSidebarPointed: boolean
  lastBlockId: number | null
  setLastBlockId: (value: number) => void
  lessonId: number
}

export const CMenu = ({
  setNewItem,
  isSidebarPointed,
  lastBlockId,
  setLastBlockId,
  lessonId,
}: Props) => {
  const [addedItemId, setAddedItemId] = useState<number>(0)
  const dispatch = useAppDispatch()

  const onAddNewItem = (type: AddedMaterial) => {
    const newAddedItemId = addedItemId + 1
    setAddedItemId(newAddedItemId)
    const newItem: NewItem = {
      type,
      id: newAddedItemId,
    }
    setNewItem(newItem)
  }

  const addNewItemModule = () => {
    const newBlockId = (lastBlockId ?? 0) + 1
    const newItem: Step = {
      id: newBlockId,
      title: '',
      serial: 1,
      attachments: [],
      content_text: '',
      blockItems: [],
      lesson: lessonId,
    }
    setLastBlockId(newBlockId)
    dispatch(setActiveBlockId({ blockId: newItem.id }))
    dispatch(addNewBlock(newItem))
  }

  return (
    <aside className={clsx(s.container, isSidebarPointed && s.pointed)}>
      <div className={s.block}>
        <Typography variant="caption" className={s.title}>
          Теоретический материал
        </Typography>
        <AddCard children={'Добавить текст'} onClick={() => onAddNewItem('text')} />
        <AddCard children={'Добавить видео'} onClick={() => onAddNewItem('video')} />
        <AddCard children={'Добавить изображение'} onClick={() => onAddNewItem('image')} />
      </div>

      <div className={s.block}>
        <Typography variant="caption" className={s.title}>
          Интерактивные задания (добавить тест)
        </Typography>
        <AddCard children={'Добавить тест'} onClick={() => onAddNewItem('test')} />
      </div>

      <div className={s.block}>
        <Typography variant="caption" className={s.title}>
          Структура курса
        </Typography>
        <AddCard children={'Добавить блок'} onClick={addNewItemModule} />
      </div>
    </aside>
  )
}
