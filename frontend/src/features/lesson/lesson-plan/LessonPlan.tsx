import { DropdownCard } from '@features/course'
import { Button } from '@shared/components'
import { useState } from 'react'

import { SelectedStep } from '../LessonComponent'
import { lessonStepsData } from '../lessonStepsData'

import { LessonPlanItem } from './lesson-plan-item/LessonPlanItem'
import s from './lesson-plan.module.scss'

type Props = {
  setSelectedStep: (selectedStep: SelectedStep) => void
}
export const LessonPlan = ({ setSelectedStep }: Props) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([lessonStepsData[0].id])

  const onItemClick = (item: SelectedStep) => {
    setSelectedStep(item)
    setCompletedSteps([...completedSteps, item.id])
  }
  return (
    <DropdownCard title="План урока:" blocks="6 тем" className={s.drpdnContent}>
      <ul>
        {lessonStepsData?.map((item) => (
          <LessonPlanItem
            key={item.id}
            onClick={() => onItemClick(item)}
            checked={completedSteps.includes(item.id)}
          >
            {item.title}
          </LessonPlanItem>
        ))}
      </ul>
      <Button variant="secondary" className={s.btn}>
        Материалы урока
      </Button>
    </DropdownCard>
  )
}
