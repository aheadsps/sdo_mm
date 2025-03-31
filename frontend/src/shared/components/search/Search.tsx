import { SearchIcon } from '@assets/icons'

import { Input } from '../text-field'

import s from './Search.module.scss'

export const Search = () => {
  return (
    <div className={s.container}>
      <div className={s.box}>
        <Input className={s.input} placeholder="Поиск" />
        <SearchIcon className={s.icon} />
      </div>
    </div>
  )
}
