import { AddedMaterial, LessonBlock, NewItem } from '@services/slices/constructor/constructor.types'
import { addNewBlock } from '@services/slices/constructor/constructorSlice'
import { useAppDispatch } from '@services/store'
import { Typography } from '@shared/components'
import clsx from 'clsx'

import { AddCard } from './addCard/AddCard'
import s from './constructorMenu.module.scss'

type Props = {
  setNewItem: (newItem: NewItem) => void
  activeBlockId: number
  isSidebarPointed: boolean
  setActiveBlockId: (activeBlockId: number | null) => void
}

export const CMenu = ({ setNewItem, activeBlockId, isSidebarPointed, setActiveBlockId }: Props) => {
  const dispatch = useAppDispatch()

  const onAddNewItem = (type: AddedMaterial) => {
    const newItem: NewItem = {
      type,
      id: activeBlockId,
    }
    setNewItem(newItem)
  }

  const addNewItemModule = () => {
    const newItem: LessonBlock = {
      id: 4,
      title: '',
      blockItems: [],
    }
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
        <AddCard children={'Добавить модуль'} onClick={addNewItemModule} />
      </div>
    </aside>
  )
}
