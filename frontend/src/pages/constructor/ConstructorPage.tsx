import SettingsIcon from '@assets/icons/SettingsIcon'
import { NewItem } from '@services/slices/constructor/constructor.types'
import { LessonBlock } from '@services/slices/constructor/constructor.types'
import {
  addNewBlockItem,
  deleteBlockItem,
  selectBlocks,
  setBlocks,
  setActiveBlockId,
  selectActiveBlockId,
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
  /* const [activeBlockId, setActiveBlockId] = useState<number | null>(1) */
  const [isSidebarPointed, setIsSidebarPointed] = useState(false)
  const activeBlockId = useAppSelector(selectActiveBlockId)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setBlocks(lessonBlocks))
  }, [dispatch])

  const blocks = useAppSelector(selectBlocks)
  const [lastBlockId, setLastBlockId] = useState<number | null>(
    lessonBlocks[lessonBlocks.length - 1].id
  )

  /* const onBlockActive = (id: number) => {
    setActiveBlockId((prevId) => (prevId === id ? null : id))
  } */

  const onBlockActive = (blockId: number) => {
    dispatch(setActiveBlockId({ blockId }))
  }

  const onAddNewItem = (newItem: NewItem) => {
    if (activeBlockId) {
      dispatch(addNewBlockItem({ newItem, blockId: activeBlockId }))
    }
    if (isSidebarPointed) {
      setIsSidebarPointed(false)
    }
  }

  const onDeleteBlock = (blockId: number) => {
    dispatch(deleteBlockItem({ blockId }))
  }

  console.log(blocks[0]?.blockItems)

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
              isSidebarPointed={isSidebarPointed}
              lastBlockId={lastBlockId}
              setLastBlockId={setLastBlockId}
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
