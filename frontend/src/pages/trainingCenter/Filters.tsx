import { InputWithIcon, Select, Search } from '@shared/components'
import { useToggle } from '@shared/hooks'
import clsx from 'clsx'
import { useState } from 'react'

import { CalendarIcon } from '@assets/icons'

import s from './trainingCenter.module.scss'

const courseOptions = [
  {
    id: 1,
    value: 'status 1',
  },
  {
    id: 2,
    value: 'status 2',
  },
]

export const Filters = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const { toggle, isOpen } = useToggle()
  const hiddenClass = isSearchFocused && s.hidden

  return (
    <div className={s.filtersContainer}>
      <div className={clsx(s.filters, hiddenClass)}>
        <InputWithIcon
          placeholder={'Дата создания'}
          content={'Здесь будет календарь'}
          onClick={toggle}
          icon={<CalendarIcon />}
          isOpen={isOpen}
          className={s.filterItem}
        >
          Здесь будет календарь
        </InputWithIcon>
        <Select placeholder="Статус курса" options={courseOptions} className={s.filterItem} />
        <Select
          placeholder="Количество студентов"
          options={courseOptions}
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
