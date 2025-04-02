import { Card } from '@shared/components'

import { BlockHeader } from '../block-header/BlockHeader'

import s from './expanded-content.module.scss'

const columns = ['Тема блока', 'Условия видимости', 'Конструкторт']

export const ExpandedContent = () => {
  return (
    <div className={s.expandedContent}>
      <BlockHeader columns={columns} />
      <Card>Card content</Card>
    </div>
  )
}
