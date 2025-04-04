import { Search } from '@shared/components/search'

import { AddItemIcon } from '@assets/icons'
import { StudentBlock } from '@pages/trainingCenter/studentsList/studentBlock'

import { BlockHeader } from '../course/program/block-header/BlockHeader'

import { columns } from './MockData'
import s from './studentsList.module.scss'

export const StudentList = () => {
  return (
    <div className={s.container}>
      <Search />
      <BlockHeader columns={columns} />
      <div className={s.content}>
        <StudentBlock />
        <StudentBlock />
        <StudentBlock />
        <StudentBlock />
        <button className={s.addButton}>
          <AddItemIcon height={'12px'} width={'12px'} />
        </button>
      </div>
    </div>
  )
}
