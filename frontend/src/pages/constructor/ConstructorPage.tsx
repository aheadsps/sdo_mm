import SettingsIcon from '@assets/icons/SettingsIcon'
import { CMenu, Title } from '@shared/components'
import { Header } from '@shared/components'
import { ReactNode, useState } from 'react'

import { BlockDropdown } from './block-dropdown/BlockDropdown'
import s from './constructorPage.module.scss'


type AddedMaterial = 'text' | 'video' | 'image' | 'test'

export type NewItem = {
  type: AddedMaterial
  description?: string[]
  layout: ReactNode
}

const dropdowns = [
  {
    id: 1,
    title: 'Зачем нужны СИЗ? Психология безопасности',
  },
  {
    id: 2,
    title: 'Основные виды СИЗ и их роль',
  },
  {
    id: 3,
    title: 'Как выбрать СИЗ? Комфорт vs безопасность',
  },
]

export const ConstructorPage: React.FC = () => {
  const [activeBlockId, setActiveBlockId] = useState<number | null>(null)
  const [blocks, setBlocks] = useState(dropdowns)

  const [blocksItems, setBlocksItems] = useState<{ [key: number]: NewItem[] }>({
    1: [],
    2: [],
    3: [],
  })

  const onBlockActive = (id: number) => {
    setActiveBlockId((prevId) => (prevId === id ? null : id))
  }

  const onAddNewItem = (newItem: NewItem) => {
    if (activeBlockId === null) return
    setBlocksItems((prevBlocksItems) => {
      const updatedItems = [...(prevBlocksItems[activeBlockId] || []), newItem]
      return {
        ...prevBlocksItems,
        [activeBlockId]: updatedItems,
      }
    })
  }

  const deleteBlock = (blockId: number) => {
    const filteredBlocks = blocks.filter((block) => block.id !== blockId)
    setBlocks(filteredBlocks)
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
            <CMenu setNewItem={onAddNewItem} />
            <main className={s.main}>
              {blocks.map((item) => (
                <BlockDropdown
                  key={item.id}
                  isActiveBlock={activeBlockId === item.id}
                  title={item.title}
                  newItems={blocksItems[item.id] || []}
                  onActive={() => onBlockActive(item.id)}
                  deleteBlock={() => deleteBlock(item.id)}
                />
              ))}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
