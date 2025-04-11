import SettingsIcon from '@assets/icons/SettingsIcon'
import { NewItem } from '@services/slices/constructor/constructor.types'
import { LessonBlock } from '@services/slices/constructor/constructor.types'
import {
  addNewBlockItem,
  deleteBlockItem,
  selectBlocks,
  setBlocks,
} from '@services/slices/constructor/constructorSlice'
import { useAppDispatch, useAppSelector } from '@services/store'
import { CMenu, Title } from '@shared/components'
import { Header } from '@shared/components'
import { useEffect, useState } from 'react'

import { BlockDropdown } from './block-dropdown/BlockDropdown'
import s from './constructorPage.module.scss'

const lessonBlocks: LessonBlock[] = [
  {
    id: 1,
    title: 'Зачем нужны СИЗ? Психология безопасности',
    blockItems: [],
  },
  {
    id: 2,
    title: 'Основные виды СИЗ и их роль',
    blockItems: [],
  },
  {
    id: 3,
    title: 'Как выбрать СИЗ? Комфорт vs безопасность',
    blockItems: [],
  },
]

export const ConstructorPage: React.FC = () => {
  const [activeBlockId, setActiveBlockId] = useState<number | null>(null)
  const [isSidebarPointed, setIsSidebarPointed] = useState(false)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setBlocks(lessonBlocks))
  }, [dispatch])

  const blocks = useAppSelector(selectBlocks)

  const onBlockActive = (id: number) => {
    setActiveBlockId((prevId) => (prevId === id ? null : id))
  }

  const onAddNewItem = (newItem: NewItem) => {
    dispatch(addNewBlockItem({ newItem, blockId: activeBlockId as number }))
    if (isSidebarPointed) {
      setIsSidebarPointed(false)
    }
  }

  const onDeleteBlock = (blockId: number) => {
    dispatch(deleteBlockItem({ blockId }))
  }

  return (
    <>
      <Header />
      <div className={s.constructorWrapper}>
        <div className={s.wrapper}>
          <Title
            txt="Конструктор курса"
            btn0={<SettingsIcon />}
            btn1="Предпросмотр"
            btn2="Опубликовать"
            className={s.visible}
          />
          <div className={s.container}>
            <CMenu
              setNewItem={onAddNewItem}
              activeBlockId={activeBlockId as number}
              isSidebarPointed={isSidebarPointed}
            />
            <main className={s.main}>
              {blocks.map((item) => (
                <BlockDropdown
                  key={item.id}
                  isActiveBlock={activeBlockId === item.id}
                  title={item.title}
                  newItems={item.blockItems || []}
                  onActive={() => onBlockActive(item.id)}
                  deleteBlock={() => onDeleteBlock(item.id)}
                  setIsSidebarPointed={setIsSidebarPointed}
                />
              ))}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
