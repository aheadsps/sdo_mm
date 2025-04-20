import { Button, Input, Modal, Typography } from '@shared/components'

import s from './student-assignment.module.scss'

type Props = {
  close: () => void
}
export const AssignmentGradeModal = ({ close }: Props) => {
  return (
    <Modal close={close} title="Оценка задания" titleStyle="header_3">
      <div className={s.modalContent}>
        <div className={s.grade}>
          <Typography variant="body_1">Принять без оценки</Typography>
          <input type="checkbox" />
        </div>
        <div className={s.grade}>
          <Typography variant="body_1">Автооценка теста</Typography>
          <Typography variant="body_1" className={s.points}>
            70 баллов из 100
          </Typography>
        </div>
        <div className={s.grade}>
          <Typography variant="body_1">Итоговая оценка преподавателя</Typography>
          <Input placeholder="Введите значение" />
        </div>
      </div>
      <Button variant="primary">Принять</Button>
    </Modal>
  )
}
