import { Step } from '@services/api'
import { Card } from '@shared/components'

import { BlockHeader } from '../block-header/BlockHeader'

import s from './expanded-content.module.scss'

const columns = ['Тема блока', 'Условия видимости', 'Конструкторт']

type Props = {
  steps: Step[]
}
export const ExpandedContent = ({ steps }: Props) => {
  return (
    <div className={s.expandedContent}>
      <BlockHeader columns={columns} />
      <Card className={s.card}>
        {/*  {steps.map((step) => (
          <LessonContent
            key={step.serial}
            lesson={step}
            options={optionsAccess}
            isExpandableContent
          />
        ))} */}
        {steps.map((step) => (
          <div key={step.serial}>{step.content_text}</div>
        ))}
      </Card>
    </div>
  )
}
