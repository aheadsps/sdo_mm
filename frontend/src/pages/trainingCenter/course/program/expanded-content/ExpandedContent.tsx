import { routes } from '@routes/routes'
import { Step } from '@services/api'
import { setCurrentSteps } from '@services/slices/constructor/constructorSlice'
import { useAppDispatch } from '@services/store'
import { Card } from '@shared/components'

import { BlockHeader } from '../block-header/BlockHeader'
import { optionsAccess } from '../data'
import { LessonContent } from '../lesson-content/LessonContent'

import s from './expanded-content.module.scss'

const columns = ['Тема блока', 'Условия видимости', 'Конструкторт']

type Props = {
  lessonId: number
  steps: Step[]
  onClick: () => void
}
export const ExpandedContent = ({ lessonId, steps, onClick }: Props) => {
  const dispatch = useAppDispatch()
  const onStepClick = () => {
    onClick()
    dispatch(setCurrentSteps(steps))
  }
  const path = `${routes.constructor}/${lessonId}`
  return (
    <div className={s.expandedContent}>
      <BlockHeader columns={columns} />
      <Card className={s.card}>
        {steps.map((step) => (
          <LessonContent
            key={step.serial}
            lesson={step}
            options={optionsAccess}
            isExpandableContent
            onClick={onStepClick}
            path={path}
          />
        ))}
      </Card>
    </div>
  )
}
