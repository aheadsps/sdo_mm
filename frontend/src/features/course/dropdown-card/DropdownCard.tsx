import { useToggle } from '@shared/hooks/useToggle'
import clsx from 'clsx'
import { ComponentPropsWithoutRef } from 'react'

import { ArrowDownIcon, ArrowUpIcon } from '@assets/icons'

import { LessonItemTitle } from '../lesson-item-title/LessonItemTitle'

import s from './dropdown-card.module.scss'

type Props = {
  title: string
  blocks: string
} & ComponentPropsWithoutRef<'div'>

export const DropdownCard = ({ className, title, children, blocks }: Props) => {
  const { isOpen: isOpenDropdown, toggle: toggleDropdown } = useToggle()

  return (
    <div className={s.dropdownCard}>
      <div className={s.dropdownHeader} onClick={toggleDropdown}>
        <LessonItemTitle onClick={toggleDropdown} title={title} blocks={blocks}>
          {isOpenDropdown ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </LessonItemTitle>
      </div>
      {/*  className={s.dropdownContent}*/}
      {isOpenDropdown && (
        <div className={clsx(s.dropdownContent, className as string)}>{children}</div>
      )}
    </div>
  )
}
