import clsx from 'clsx'
import { ComponentPropsWithRef } from 'react'

import { SearchIcon } from '@assets/icons'

import { Input } from '../text-field'

import s from './Search.module.scss'

type Props = {
  className?: string
} & ComponentPropsWithRef<'input'>
export const Search = ({ className, onBlur, onFocus, autoFocus }: Props) => {
  return (
    <div className={clsx(s.container, className)}>
      <div className={s.box}>
        <Input
          className={s.input}
          placeholder="Поиск"
          onFocus={onFocus}
          onBlur={onBlur}
          autoFocus={autoFocus}
        />
        <SearchIcon className={s.icon} />
      </div>
    </div>
  )
}
