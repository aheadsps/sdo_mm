import { useState } from 'react'

import { SearchIcon } from '@assets/icons'
import { studentType } from '@pages/trainingCenter/studentsList/data'

import { Input } from '../text-field'

import s from './Search.module.scss'
type Props = {
  students?: studentType[]
  className?: string
}
export const Search = ({ students }: Props) => {
  const [isDatalistVisible, setDatalistVisible] = useState<boolean>(false)
  return (
    <div className={s.container}>
      <div className={s.box}>
        <Input
          list="variants"
          id="search"
          className={s.input}
          placeholder="Поиск"
          type="text"
          onFocus={() => setDatalistVisible(true)}
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
