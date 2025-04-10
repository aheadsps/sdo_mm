import { AddItemIcon, EditIcon, BasketIcon } from '@assets/icons'
import { DropdownCard } from '@shared/components'
import { Fragment } from 'react'

import { NewItem } from '../ConstructorPage'

import s from './block-dropdown.module.scss'

type Props = {
  newItems: NewItem[]
  isActiveBlock: boolean
  title?: string
  onActive: () => void
}

export const BlockDropdown = ({ newItems, isActiveBlock, title, onActive }: Props) => {
  const toggleDropdown = () => {
    onActive()
  }

  return (
    <DropdownCard
      title={title || ''}
      icons={[<EditIcon height={'12px'} width={'12px'} />, <BasketIcon />]}
      wrapperClassName={s.dropdownHeader}
      className={s.dropdownContent}
      isOpen={isActiveBlock}
      toggle={toggleDropdown}
    >
      {newItems.map((item, index) => (
        <Fragment key={`${index}${item.type}`}>{item.layout}</Fragment>
      ))}
      <AddItemIcon className={s.icon} />
    </DropdownCard>
  )
}
