import { useToggle } from '@shared/hooks/useToggle'
import { ComponentPropsWithoutRef } from 'react'

import { LessonItemTitle } from '../../../features/course/lesson-item-title/LessonItemTitle'

import s from './dropdown-card.module.scss'

import { ArrowDownIcon, ArrowUpIcon } from '@/assets/icons'

type Props = {
  title: string
  blocks: string
} & ComponentPropsWithoutRef<'div'>

export const DropdownCard = ({ title, children, blocks }: Props) => {
  const { isOpen: isOpenDropdown, toggle: toggleDropdown } = useToggle()

  return (
    <div className={s.dropdownCard}>
      <div className={s.dropdownHeader} onClick={toggleDropdown}>
        <LessonItemTitle onClick={toggleDropdown} title={title} blocks={blocks}>
          {isOpenDropdown ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </LessonItemTitle>
      </div>
      {isOpenDropdown && <div className={s.dropdownContent}>{children}</div>}
    </div>
  )
}
