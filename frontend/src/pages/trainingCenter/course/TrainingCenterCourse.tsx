import { EditIcon } from '@assets/icons'
import { useGetCourseQuery } from '@services/api'
import { selectCourse, selectCurrentCourseId, setCourseById } from '@services/slices'
import { useAppDispatch, useAppSelector } from '@services/store'
import {
  Typography,
  Button,
  Input,
  Tabs,
  Textarea,
  type Tab,
  Modal,
  Loader,
} from '@shared/components'
import { AddMaterials } from '@shared/components'
import { withLayout } from '@shared/HOC'
import { useScreenWidth, useToggle } from '@shared/hooks'
import { useState } from 'react'

import { StudentsList } from '../course/studentsList'

import { AboutCourse } from './aboutCourse'
import { AssignmentsGrades } from './assignments-grades'
import { Program } from './program/Program'
import s from './training-course.module.scss'

const tabsData: Tab[] = [
  {
    label: 'О курсе',
    content: <AboutCourse />,
  },
  {
    label: 'Программа',
    content: <Program />,
  },
  {
    label: 'Список студентов',
    content: <StudentsList />,
  },
  {
    label: 'Оценки и задания',
    content: <AssignmentsGrades />,
  },
]

const Course = () => {
  const dispatch = useAppDispatch()
  const currentId = useAppSelector(selectCurrentCourseId)
  // console.log(currentId)
  const { data: course, isLoading } = useGetCourseQuery(currentId)
  if (course) {
    dispatch(setCourseById(course))
  }

  const currentCourse = useAppSelector(selectCourse)

  const [isEditMode, setIsEditMode] = useState(false)
  const initialValue = 'Безопасность при работе с электроинструментом'
  const [title, setTitle] = useState(initialValue)
  const { isTablet } = useScreenWidth()
  const { isOpen: isModalOpen, close: closeModal, open: openModal } = useToggle()

  const toggleEditClick = () => {
    setIsEditMode(!isEditMode)
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
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
                <Typography variant="header_2">{currentCourse.name}</Typography>
              )}
            </div>
            <Button onClick={openModal}>Добавить материал</Button>
          </div>
          <div className={s.container}>
            <Tabs tabs={tabsData} variant="secondary" className={s.tabs} />
          </div>
          {isModalOpen && (
            <Modal
              close={closeModal}
              title="Добавить материалы"
              children={<AddMaterials />}
              titleStyle="header_2"
            />
          )}
        </>
      )}
    </>
  )
}

export const TrainingCenterCourse = withLayout(Course)
