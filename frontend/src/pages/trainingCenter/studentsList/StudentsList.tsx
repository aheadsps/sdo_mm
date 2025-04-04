import { Search } from '@shared/components/search'
import { StudentBlock } from '@shared/components/studentBlock'

import { BlockHeader } from '../course/program/block-header/BlockHeader'

import s from './studentsList.module.scss'

const columns: string[] = ['Студент', 'Прогресс', 'Действия']

export const StudentList = () => {
  return (
    <div className={s.container}>
      <Search />
      <div className={s.content}>
        <BlockHeader columns={columns} />
        <StudentBlock />
        <StudentBlock />
        <StudentBlock />
        <StudentBlock />
      </div>
    </div>
  )
}
