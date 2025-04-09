import { AddItemIcon, BasketIcon, EditIcon } from '@assets/icons'
import { DropdownCard } from '@shared/components'

import s from './block-dropdown.module.scss'

const icons = [<EditIcon height={'12px'} width={'12px'} />, <BasketIcon />]

export const BlockDropdown = () => {
  return (
    <DropdownCard
      title="Зачем нужны СИЗ? Психология безопасности"
      icons={icons}
      wrapperClassName={s.dropdownHeader}
      className={s.dropdownContent}
    >
      <AddItemIcon />
    </DropdownCard>
  )
}
