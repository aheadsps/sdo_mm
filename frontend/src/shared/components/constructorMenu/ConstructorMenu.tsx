import { AddedMaterial, LessonBlock, NewItem } from '@services/slices/constructor/constructor.types'
import { addNewBlock } from '@services/slices/constructor/constructorSlice'
import { useAppDispatch } from '@services/store'
import { Typography } from '@shared/components'
import clsx from 'clsx'
import { useState } from 'react'

import { AddCard } from './addCard/AddCard'
import s from './constructorMenu.module.scss'

type Props = {
  setNewItem: (newItem: NewItem) => void
  isSidebarPointed: boolean
  setActiveBlockId: (activeBlockId: number | null) => void
  lastBlockId: number | null
  setLastBlockId: (value: number) => void
}

export const CMenu = ({
  setNewItem,
  isSidebarPointed,
  setActiveBlockId,
  lastBlockId,
  setLastBlockId,
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
    const newBlockId = lastBlockId ? ++lastBlockId : 1
    const newItem: LessonBlock = {
      id: newBlockId,
      title: '',
      blockItems: [],
    }
    setLastBlockId(newBlockId)
    setActiveBlockId(newItem.id)
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
