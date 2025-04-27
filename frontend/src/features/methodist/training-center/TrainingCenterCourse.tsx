import { EditIcon } from '@assets/icons'
import { routes } from '@routes/routes'
import { useGetCourseQuery } from '@services/api'
import { setCourseById } from '@services/slices'
import { setCurrentLessons } from '@services/slices/constructor/constructorSlice'
import { useAppDispatch } from '@services/store'
import {
  Button,
  Tabs,
  type Tab,
  Modal,
  Loader,
  AddMaterials,
  EditableText,
  BackToPage,
} from '@shared/components'
import { withLayout } from '@shared/HOC'
import { useToggle } from '@shared/hooks'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { AboutCourse } from './tabs/aboutCourse'
import { AssignmentsGrades } from './tabs/assignments-grades'
import { Program } from './tabs/program/Program'
import { StudentsList } from './tabs/studentsList'
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
  const [title, setTitle] = useState('')

  const { data: course, isLoading } = useGetCourseQuery(Number(id))

  useEffect(() => {
    if (course) {
      dispatch(setCourseById(course))
      dispatch(setCurrentLessons({ lessons: course.lessons, id: course.id }))
    }

    if (course?.name) {
      setTitle(course.name)
    }
  }, [dispatch, course, course?.name])

  const [isEditMode, setIsEditMode] = useState(false)

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
          <BackToPage to={routes.trainingCenter}>Вернуться к списку курсов</BackToPage>
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
