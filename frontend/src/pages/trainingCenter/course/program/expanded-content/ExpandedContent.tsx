import { Card } from '@shared/components'

import { BlockHeader } from '../block-header/BlockHeader'
import { lessonsData, options } from '../data'
import { LessonContent } from '../lesson-content/LessonContent'

import s from './expanded-content.module.scss'

const columns = ['Тема блока', 'Условия видимости', 'Конструкторт']

export const ExpandedContent = () => {
  return (
    <div className={s.expandedContent}>
      <BlockHeader columns={columns} />
      <Card className={s.card}>
        {lessonsData.map((lesson) => (
          <LessonContent
            key={lesson.id}
            lesson={lesson}
            optionsDate={options}
            optionsFormat={options}
            isExpandableContent
          />
        ))}
      </Card>
    </div>
  )
}
