import SettingsIcon from '@assets/icons/SettingsIcon'
import { BlockDropdown } from '@features/methodist/constructor/block-dropdown/BlockDropdown'
import { useGetLessonQuery } from '@services/api'
import { NewItem } from '@services/slices/constructor/constructor.types'
import {
  addNewBlockItem,
  deleteBlockItem,
  setActiveBlockId,
  selectActiveBlockId,
  selectCurrentSteps,
  setCurrentLesson,
  setCurrentSteps,
} from '@services/slices/constructor/constructorSlice'
import { useAppDispatch, useAppSelector } from '@services/store'
import { CMenu, Title, Header } from '@shared/components'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import s from './constructorPage.module.scss'

export const ConstructorPage: React.FC = () => {
  const [isSidebarPointed, setIsSidebarPointed] = useState(false)
  const activeBlockId = useAppSelector(selectActiveBlockId)
  const { id } = useParams()
  const { data: lesson } = useGetLessonQuery(Number(id))

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (lesson) {
      dispatch(setCurrentLesson(lesson))
      dispatch(setCurrentSteps(lesson.steps))
    }
  }, [dispatch, lesson])

  const steps = useAppSelector(selectCurrentSteps)

  const [lastBlockId, setLastBlockId] = useState<number | null>(steps[steps.length - 1]?.id)

  useEffect(() => {
    if (steps.length) {
      const latestId = steps[steps.length - 1].id
      setLastBlockId(latestId)
    }
  }, [steps])

  const onBlockActive = (blockId: number) => {
    if (activeBlockId === blockId) {
      dispatch(setActiveBlockId({ blockId: null }))
    } else {
      dispatch(setActiveBlockId({ blockId }))
    }
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
            disabled
          />
          <div className={s.container}>
            <CMenu
              setNewItem={onAddNewItem}
              isSidebarPointed={isSidebarPointed}
              lastBlockId={lastBlockId}
              setLastBlockId={setLastBlockId}
              lessonId={Number(id)}
            />
            <main className={s.main}>
              {steps.map((item) => (
                <BlockDropdown
                  key={item.id}
                  blockId={item.id}
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
