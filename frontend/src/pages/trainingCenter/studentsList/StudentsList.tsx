import { Modal } from '@shared/components'
import { AddComment } from '@shared/components/modal/addComment'
import { AddItemIcon } from '@assets/icons'
import { StudentBlock } from '@pages/trainingCenter/studentsList/studentBlock'
import { Search } from '@shared/components/search'
import { useToggle } from '@shared/hooks'
import { useState } from 'react'

import { BlockHeader } from '../course/program/block-header/BlockHeader'

import { columns, studentsData } from './data'
import s from './studentsList.module.scss'

export const StudentsList = () => {
  const [newStudentCount, setNewStudentCount] = useState<number[]>([])
  const { isOpen: isOpenModal, toggle: toggleModal } = useToggle()

  const onAddNewStudent = () => {
    setNewStudentCount((prev) => [...prev, prev.length + 1])
  }
  return (
    <div className={s.container}>
      {!isOpenModal && (
        <Modal
          close={toggleModal}
          title="Васильевa Владислава Геннадиевнa"
          children={<AddComment />}
          titleStyle="header_6"
        />
      )}
      <Search students={studentsData} />
      <BlockHeader columns={columns} className={s.blockHeader} />
      <div className={s.content}>
        {studentsData.map((student) => {
          return (
            <div key={student.id}>
              <StudentBlock student={student} />
            </div>
          )
        })}
        {newStudentCount.map((item) => (
          <div key={item}>
            <StudentBlock />
          </div>
        ))}
        <button className={s.addButton}>
          <AddItemIcon height={'12px'} width={'12px'} onClick={onAddNewStudent} />
        </button>
      </div>
    </div>
  )
}
