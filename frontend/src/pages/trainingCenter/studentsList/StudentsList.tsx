import { Search } from '@shared/components/search'
import { StudentBlock } from '@shared/components/studentBlock'

import s from './studentsList.module.scss'

export const StudentList = () => {
  return (
    <div className={s.container}>
      <Search />
      <div className={s.content}>
        <StudentBlock />
        <StudentBlock />
        <StudentBlock />
        <StudentBlock />
      </div>
    </div>
  )
}
