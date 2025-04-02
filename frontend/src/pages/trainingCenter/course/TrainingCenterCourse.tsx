import { Typography, Button, Input, Tabs, Textarea, type Tab } from '@shared/components'
import { withLayout } from '@shared/HOC'
import { useScreenWidth } from '@shared/hooks'
import { useState } from 'react'

import { EditIcon } from '@assets/icons'

import s from './training-course.module.scss'

const tabsData: Tab[] = [
  {
    label: 'О курсе',
    content: <div>О курсе</div>,
  },
  {
    label: 'Программа',
    content: <div>Программа</div>,
  },
  {
    label: 'Список студентов',
    content: <div>Список студентов</div>,
  },
  {
    label: 'Оценки и задания',
    content: <div>Оценки и задания</div>,
  },
]

const Course = () => {
  const [isEditMode, setIsEditMode] = useState(false)
  const initialValue = 'Безопасность при работе с электроинструментом'
  const [title, setTitle] = useState(initialValue)
  const { isTablet } = useScreenWidth()

  const toggleEditClick = () => {
    setIsEditMode(!isEditMode)
  }

  return (
    <>
      <div className={s.titleBlock}>
        <div className={s.title}>
          <EditIcon width={'15px'} height={'15px'} onClick={toggleEditClick} />
          {isEditMode ? (
            isTablet ? (
              <Textarea value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
            ) : (
              <Input value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
            )
          ) : (
            <Typography variant="header_2">
              Безопасность при работе с электроинструментом
            </Typography>
          )}
        </div>
        <Button>Добавить материал</Button>
      </div>
      <div className={s.container}>
        <Tabs tabs={tabsData} variant="secondary" className={s.tabs} />
      </div>
    </>
  )
}

export const TrainingCenterCourse = withLayout(Course)
