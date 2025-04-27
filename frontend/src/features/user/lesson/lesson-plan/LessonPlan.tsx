import { StepView, Test } from '@services/api'
import { DropdownCard, Button } from '@shared/components'
import { useToggle } from '@shared/hooks'
import { useState } from 'react'

import { LessonPlanItem } from './lesson-plan-item/LessonPlanItem'
import s from './lesson-plan.module.scss'

type Props = {
  steps: StepView[]
  tests: Test
  setIsMaterialsButtonClicked: (isMaterialsButtonClicked: boolean) => void
  onTestClick: (arg: boolean) => void
  onClick: (item: StepView) => void
}
export const LessonPlan = ({
  steps,
  tests,
  setIsMaterialsButtonClicked,
  onClick,
  onTestClick,
}: Props) => {
  console.log(tests)
  const [completedSteps, setCompletedSteps] = useState<number[]>([steps[0].id])
  const { isOpen, toggle } = useToggle()
  const onItemClick = (item: StepView) => {
    onClick(item)
    setCompletedSteps([...completedSteps, item.id])
    onTestClick(false)
  }
  const onMaterialsButtonClicked = () => {
    setIsMaterialsButtonClicked(true)
  }
  const hendleTestClick = (id: number) => {
    setCompletedSteps([...completedSteps, id])
    onTestClick(true)
  }
  return (
    <DropdownCard
      title="План урока:"
      blocks={`${steps.length} темы`}
      className={s.drpdnContent}
      isOpen={isOpen}
      toggle={toggle}
    >
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
        <LessonPlanItem
          key={tests.id}
          onClick={() => hendleTestClick(tests.id)}
          checked={completedSteps.includes(tests.id)}
        >
          Тестирование
        </LessonPlanItem>
      </ul>
      {/*<ul>
         {tests.questions?.map((item) => (
          <LessonPlanItem
            key={Math.floor(Math.random() * 1000) + 1}
            onClick={() => onItemClick(item)}
            checked={completedSteps.includes(item.id)}
          >
            Тест
          </LessonPlanItem>
        ))}
      </ul> */}
      <Button variant="secondary" className={s.btn} onClick={onMaterialsButtonClicked}>
        Материалы урока
      </Button>
    </DropdownCard>
  )
}
