import { DropdownCard } from '@shared/components'
import { Button } from '@shared/components'
import { useState } from 'react'

import { SelectedStep } from '../LessonComponent'
import { lessonStepsData } from '../lessonStepsData'

import { LessonPlanItem } from './lesson-plan-item/LessonPlanItem'
import s from './lesson-plan.module.scss'

type Props = {
  setIsMaterialsButtonClicked: (isMaterialsButtonClicked: boolean) => void
  onClick: (item: SelectedStep) => void
}
export const LessonPlan = ({ setIsMaterialsButtonClicked, onClick }: Props) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([lessonStepsData[0].id])

  const onItemClick = (item: SelectedStep) => {
    onClick(item)
    setCompletedSteps([...completedSteps, item.id])
  }

  const onMaterialsButtonClicked = () => {
    setIsMaterialsButtonClicked(true)
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
      <Button variant="secondary" className={s.btn} onClick={onMaterialsButtonClicked}>
        Материалы урока
      </Button>
    </DropdownCard>
  )
}
