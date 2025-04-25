import { Select, Search } from '@shared/components'
// import { useToggle } from '@shared/hooks'
import { DatePickerCustom } from '@shared/components/datePicker/DatePickerCustom'
import clsx from 'clsx'
import { useState } from 'react'

import s from './trainingCenter.module.scss'

const courseStatuses = [
  { id: 1, value: 'Опубликован' },
  { id: 2, value: 'Завершён' },
  { id: 3, value: 'Черновик' },
  { id: 4, value: 'Архив' },
]

const countOptions = [
  {
    id: 1,
    value: '0 - 199',
  },
  {
    id: 2,
    value: '200 - 999',
  },
  {
    id: 3,
    value: '1000+',
  },
]

export const Filters = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  // const { toggle, isOpen } = useToggle()
  const hiddenClass = isSearchFocused && s.hidden

  return (
    <div className={s.filtersContainer}>
      <div className={clsx(s.filters, hiddenClass)}>
        <DatePickerCustom placeholder={'Дата создания'} className={s.filterItem} />

        <Select placeholder="Статус курса" options={courseStatuses} className={s.filterItem} />
        <Select
          placeholder="Количество студентов"
          options={countOptions}
          className={s.filterItem}
        />
      </div>
      <Search
        className={s.search}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
      />
    </div>
  )
}
