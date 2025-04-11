import { ArrowDownIcon, ArrowUpIcon } from '@assets/icons'
import clsx from 'clsx'
import { ComponentPropsWithoutRef, Fragment, ReactNode, ChangeEvent } from 'react'

import { LessonItemTitle } from '../../../features/course/lesson-item-title/LessonItemTitle'
import { Input } from '../text-field'

import s from './dropdown-card.module.scss'

type Props = {
  title: string
  blocks?: string
  icons?: ReactNode[]
  wrapperClassName?: string
  isOpen: boolean
  toggle: () => void
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
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
  value,
  onChange,
}: Props) => {
  return (
    <div className={clsx(s.dropdownCard, wrapperClassName)}>
      <div className={s.dropdownHeader}>
        {title ? (
          <LessonItemTitle onClick={toggle} title={title} blocks={blocks}>
            <div className={s.icons}>
              {icons && icons.map((icon, index) => <Fragment key={index}>{icon}</Fragment>)}
              {isOpen ? <ArrowUpIcon onClick={toggle} /> : <ArrowDownIcon onClick={toggle} />}
            </div>
          </LessonItemTitle>
        ) : (
          <>
            <div className={s.icons}>
              <Input
                placeholder="Введите заголовок"
                className={s.input}
                value={value}
                onChange={onChange}
              />
              {icons && icons.map((icon, index) => <Fragment key={index}>{icon}</Fragment>)}
              {isOpen ? <ArrowUpIcon onClick={toggle} /> : <ArrowDownIcon onClick={toggle} />}
            </div>
          </>
        )}
      </div>
      {isOpen && <div className={clsx(s.dropdownContent, className as string)}>{children}</div>}
    </div>
  )
}
