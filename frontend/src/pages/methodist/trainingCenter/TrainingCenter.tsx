import { Filters } from '@features/methodist'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { routes } from '@routes/routes'
import { Course, useCreateCourseMutation, useGetCoversQuery } from '@services/api'
import { selectAllCovers, setAllCovers } from '@services/slices'
import { useAppDispatch, useAppSelector } from '@services/store'
import { Title, CourseCard, Modal, Loader } from '@shared/components'
import { AddScorm } from '@shared/components/modal/addScorm'
import { withLayout } from '@shared/HOC'
import { useToggle } from '@shared/hooks'
import { handleError } from '@shared/utils'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import s from './trainingCenter.module.scss'

const txt = 'Центр обучения'
const btn1 = 'Загрузить'
const btn2 = 'Создать курс'

const Training = () => {
  const { isOpen: isModalOpen, open: openModal, close: closeModal } = useToggle()

  const [createCourse] = useCreateCourseMutation()
  const navigate = useNavigate()

  const onCreateCourse = async () => {
    try {
      const res: Course = await createCourse().unwrap()

      if (res) {
        navigate(`${routes.trainingCenterCourse}/${res.id}`)
      }
    } catch (err) {
      const error = handleError(err as FetchBaseQueryError | SerializedError)
      console.log(error)
    }
  }

  const { data: covers, isLoading } = useGetCoversQuery()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (covers?.results) dispatch(setAllCovers(covers?.results))
  }, [covers?.results, dispatch])

  const allCovers = useAppSelector(selectAllCovers)

  return (
    <div className={s.container}>
      <Title txt={txt} btn1={btn1} btn2={btn2} fstBtn={openModal} scndBtn={onCreateCourse} border />
      <Filters />
      <div className={s.cardsBlock}>
        {isLoading ? (
          <Loader />
        ) : (
          allCovers.map((cover, index) => {
            return <CourseCard key={index} item={cover.event.course} />
          })
        )}
      </div>

      {isModalOpen && (
        <Modal
          close={closeModal}
          title="Загрузить SCORM-пакет"
          children={<AddScorm />}
          titleStyle="header_2"
        />
      )}
    </div>
  )
}
export const TrainingCenter = withLayout(Training)
