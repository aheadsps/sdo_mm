import { EditIcon } from '@assets/icons'
import { useGetCourseQuery } from '@services/api'
import { selectCourse, setCourseById } from '@services/slices'
import { useAppDispatch, useAppSelector } from '@services/store'
import {
  Button,
  Tabs,
  type Tab,
  Modal,
  Loader,
  AddMaterials,
  EditableText,
} from '@shared/components'
import { withLayout } from '@shared/HOC'
import { useToggle } from '@shared/hooks'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

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
  const { id } = useParams()

  const { data: course, isLoading } = useGetCourseQuery(Number(id))

  useEffect(() => {
    if (course) {
      dispatch(setCourseById(course))
    }

    if (course?.name) {
      setTitle(course.name)
    }
  }, [dispatch, course])

  const currentCourse = useAppSelector(selectCourse)

  const [isEditMode, setIsEditMode] = useState(false)
  const [title, setTitle] = useState(currentCourse.name)

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
              <EditableText isEditMode={isEditMode} title={title} setTitle={setTitle} />
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
