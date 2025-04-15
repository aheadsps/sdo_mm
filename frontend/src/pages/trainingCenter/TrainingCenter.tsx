import { routes } from '@routes/routes'
import { useGetCoursesQuery } from '@services/api'
import { selectCourses, setAllCourses } from '@services/slices'
import { useAppDispatch, useAppSelector } from '@services/store'
import { Title, CourseCard, Modal, Loader } from '@shared/components'
import { AddMaterials } from '@shared/components'
import { withLayout } from '@shared/HOC'
import { useToggle } from '@shared/hooks'
import { useNavigate } from 'react-router-dom'

import { Filters } from './Filters'
import s from './trainingCenter.module.scss'

const txt = 'Центр обучения'
const btn1 = 'Загрузить'
const btn2 = 'Создать курс'

const Training = () => {
  const { isOpen: isModalOpen, open: openModal, close: closeModal } = useToggle()
  const navigate = useNavigate()

  const goToConstructor = () => {
    navigate(routes.constructor)
  }
  const { data: courses, isLoading } = useGetCoursesQuery()
  const dispatch = useAppDispatch()
  if (courses?.results) dispatch(setAllCourses(courses?.results))

  const allCourses = useAppSelector(selectCourses)

  return (
    <div className={s.container}>
      <Title txt={txt} btn1={btn1} btn2={btn2} fstBtn={openModal} scndBtn={goToConstructor} />
      <Filters />
      <div className={s.cardsBlock}>
        {isLoading ? (
          <Loader />
        ) : (
          allCourses.map((course, index) => {
            return <CourseCard key={index} item={course} />
          })
        )}
      </div>

      {isModalOpen && (
        <Modal
          close={closeModal}
          title="Добавить материалы"
          children={<AddMaterials />}
          titleStyle="header_2"
        />
      )}
    </div>
  )
}
export const TrainingCenter = withLayout(Training)
