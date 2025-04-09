import { ArrowDownIcon, ArrowUpIcon } from '@assets/icons'
import { useToggle } from '@shared/hooks/useToggle'
import clsx from 'clsx'
import { ComponentPropsWithoutRef, ReactNode } from 'react'

import { LessonItemTitle } from '../../../features/course/lesson-item-title/LessonItemTitle'

import s from './dropdown-card.module.scss'

type Props = {
  title: string
  blocks?: string
  icons?: ReactNode[]
  wrapperClassName?: string
} & ComponentPropsWithoutRef<'div'>

export const DropdownCard = ({
  className,
  title,
  children,
  blocks,
  icons,
  wrapperClassName,
}: Props) => {
  const { isOpen: isOpenDropdown, toggle: toggleDropdown } = useToggle()

  return (
    <div className={clsx(s.dropdownCard, wrapperClassName)}>
      <div className={s.dropdownHeader} onClick={toggleDropdown}>
        <LessonItemTitle onClick={toggleDropdown} title={title} blocks={blocks}>
          <div className={s.icons}>
            {icons}
            {isOpenDropdown ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </div>
        </LessonItemTitle>
      </div>
      {isOpenDropdown && (
        <div className={clsx(s.dropdownContent, className as string)}>{children}</div>
      )}
    </div>
  )
}
