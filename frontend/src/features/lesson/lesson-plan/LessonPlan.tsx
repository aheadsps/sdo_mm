import { Lesson, StepView } from '@services/api'
import { DropdownCard, Button } from '@shared/components'
import { useState } from 'react'

// import { SelectedStep } from '../LessonComponent'
// import { lessonStepsData } from '../lessonStepsData'

import { LessonPlanItem } from './lesson-plan-item/LessonPlanItem'
import s from './lesson-plan.module.scss'

type Props = {
  steps: StepView[]
  setIsMaterialsButtonClicked: (isMaterialsButtonClicked: boolean) => void
  onClick: (item: StepView) => void
}
export const LessonPlan = ({ steps, setIsMaterialsButtonClicked, onClick }: Props) => {
  console.log(steps)
  const [completedSteps, setCompletedSteps] = useState<number[]>([steps[0].id])

  const onItemClick = (item: StepView) => {
    onClick(item)
    setCompletedSteps([...completedSteps, item.id])
  }

  const onMaterialsButtonClicked = () => {
    setIsMaterialsButtonClicked(true)
  }
  return (
    <DropdownCard title="План урока:" blocks={`${steps.length} темы`} className={s.drpdnContent}>
      <ul>
        {steps?.map((item) => (
          <LessonPlanItem
            key={item.id}
            onClick={() => onItemClick(item)}
            checked={completedSteps.includes(item.id)}
          >
            {item.title}
          </LessonPlanItem>
        ))}
        {steps?.map((item) => (
          <LessonPlanItem
            key={item.id}
            onClick={() => onItemClick(item)}
            checked={completedSteps.includes(item.id)}
          >
            {item.title}
          </LessonPlanItem>
        ))}
      </ul>
      <Button variant="secondary" className={s.btn} onClick={onMaterialsButtonClicked}>
        Материалы урока
      </Button>
    </DropdownCard>
  )
}
