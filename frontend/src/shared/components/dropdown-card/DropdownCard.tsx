import { ComponentPropsWithoutRef, useState } from 'react'

import { ArrowDownIcon, ArrowUpIcon } from '@assets/icons'

import { LessonItemTitle } from '../../../features/course/lesson-item-title/LessonItemTitle'

import s from './dropdown-card.module.scss'

type Props = {
  title: string
  blocks: string
} & ComponentPropsWithoutRef<'div'>

export const DropdownCard = ({ title, children, blocks }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={s.dropdownCard}>
      <div className={s.dropdownHeader} onClick={toggleDropdown}>
        <LessonItemTitle onClick={toggleDropdown} title={title} blocks={blocks}>
          {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </LessonItemTitle>
      </div>
      {isOpen && <div className={s.dropdownContent}>{children}</div>}
    </div>
  )
}
