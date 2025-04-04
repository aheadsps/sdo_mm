import { Search } from '@shared/components/search'

import s from './studentsList.module.scss'

export const StudentList = () => {
  return (
    <div className={s.container}>
      <Search />
      <div className={s.content}></div>
    </div>
  )
}
