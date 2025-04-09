import { AddItemIcon, BasketIcon, EditIcon } from '@assets/icons'
import { DropdownCard } from '@shared/components'
import { useToggle } from '@shared/hooks'
import { Fragment } from 'react/jsx-runtime'

import { NewItem } from '../ConstructorPage'

import s from './block-dropdown.module.scss'

type Props = {
  newItems: NewItem[]
  isActiveBlock: boolean
}
export const BlockDropdown = ({ newItems, isActiveBlock }: Props) => {
  const { isOpen: isOpenDropdown, toggle: toggleDropdown } = useToggle(isActiveBlock)

  return (
    <DropdownCard
      title="Зачем нужны СИЗ? Психология безопасности"
      icons={[<EditIcon height={'12px'} width={'12px'} />, <BasketIcon />]}
      wrapperClassName={s.dropdownHeader}
      className={s.dropdownContent}
      isOpen={isOpenDropdown}
      toggle={toggleDropdown}
    >
      {newItems.map((item, index) => (
        <Fragment key={`${index}${item.layout}`}>{item.layout}</Fragment>
      ))}
      <AddItemIcon />
    </DropdownCard>
  )
}
