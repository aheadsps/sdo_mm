import { routes } from '@routes/routes'
import { StepView } from '@services/api'
import { setActiveBlockId } from '@services/slices/constructor/constructorSlice'
import { useAppDispatch } from '@services/store'
import { Card } from '@shared/components'

import { BlockHeader } from '../block-header/BlockHeader'
import { optionsAccess } from '../data'
import { LessonContent } from '../lesson-content/LessonContent'

import s from './expanded-content.module.scss'

const columns = ['Тема блока', 'Условия видимости', 'Конструкторт']

type Props = {
  lessonId: number
  steps: StepView[]
}
export const ExpandedContent = ({ lessonId, steps }: Props) => {
  const dispatch = useAppDispatch()

  const onStepClick = (id: number) => {
    dispatch(setActiveBlockId({ blockId: id }))
  }

  return (
    <div className={s.expandedContent}>
      <BlockHeader columns={columns} />
      <Card className={s.card}>
        {steps.map((step) => (
          <LessonContent
            key={step.id}
            lesson={step}
            options={optionsAccess}
            isExpandableContent
            onClick={() => onStepClick(step.id)}
            path={`${routes.constructor}/${lessonId}`}
            isStep
          />
        ))}
      </Card>
    </div>
  )
}
