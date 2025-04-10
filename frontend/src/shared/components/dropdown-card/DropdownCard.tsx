import { ArrowDownIcon, ArrowUpIcon } from '@assets/icons'
import clsx from 'clsx'
import { ComponentPropsWithoutRef, Fragment, ReactNode } from 'react'

import { LessonItemTitle } from '../../../features/course/lesson-item-title/LessonItemTitle'

import s from './dropdown-card.module.scss'

type Props = {
  title: string
  blocks?: string
  icons?: ReactNode[]
  wrapperClassName?: string
  isOpen: boolean
  toggle: () => void
} & ComponentPropsWithoutRef<'div'>

export const DropdownCard = ({
  className,
  title,
  children,
  blocks,
  icons,
  wrapperClassName,
  isOpen,
  toggle,
}: Props) => {
  return (
    <div className={clsx(s.dropdownCard, wrapperClassName)}>
      <div className={s.dropdownHeader}>
        <LessonItemTitle onClick={toggle} title={title} blocks={blocks}>
          <div className={s.icons}>
            {icons && icons.map((icon, index) => <Fragment key={index}>{icon}</Fragment>)}
            {isOpen ? <ArrowUpIcon onClick={toggle} /> : <ArrowDownIcon onClick={toggle} />}
          </div>
        </LessonItemTitle>
      </div>
      {isOpen && <div className={clsx(s.dropdownContent, className as string)}>{children}</div>}
    </div>
  )
}
