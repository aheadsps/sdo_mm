import { SearchIcon } from '@assets/icons'
import { studentType } from '@pages/trainingCenter/course/studentsList/data'
import clsx from 'clsx'
import { ComponentPropsWithRef, useState } from 'react'

import { Input } from '../text-field'

import s from './Search.module.scss'

type Props = {
  className?: string
  students?: studentType[]
} & ComponentPropsWithRef<'input'>
export const Search = ({ className, students, onBlur, onFocus, autoFocus }: Props) => {
  const [isDatalistVisible, setDatalistVisible] = useState<boolean>(false)
  return (
    <div className={clsx(s.container, className)}>
      <div className={s.box}>
        <Input
          className={s.input}
          placeholder="Поиск"
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={() => setDatalistVisible(true)}
          autoFocus={autoFocus}
          list="variants"
          id="search"
          type="text"
        />
        {isDatalistVisible && students ? (
          <datalist id="search" className={s.list}>
            {students.map((student) => {
              return (
                <option value="student.id" key={student.id} className={s.option}>
                  {student.name}
                </option>
              )
            })}
          </datalist>
        ) : (
          ''
        )}
        <SearchIcon className={s.icon} onClick={() => setDatalistVisible(false)} />
      </div>
    </div>
  )
}
