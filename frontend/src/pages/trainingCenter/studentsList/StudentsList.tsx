import { Search } from '@shared/components/search'

import { AddItemIcon } from '@assets/icons'
import { StudentBlock } from '@pages/trainingCenter/studentsList/studentBlock'

import { BlockHeader } from '../course/program/block-header/BlockHeader'

import { columns, studentsData } from './data'
import s from './studentsList.module.scss'

export const StudentList = () => {
  return (
    <div className={s.container}>
      <Search />
      <BlockHeader columns={columns} />
      <div className={s.content}>
        {studentsData.map((student) => {
          return <StudentBlock student={student} />
        })}
        <button className={s.addButton}>
          <AddItemIcon
            height={'12px'}
            width={'12px'}
            //  onClick={onAddNewStudent}
          />
        </button>
      </div>
    </div>
  )
}
