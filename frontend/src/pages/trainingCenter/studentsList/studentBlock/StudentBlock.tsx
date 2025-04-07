import { Button, Input, ProgressBar, Typography } from '@shared/components'
import clsx from 'clsx'

import { BasketIcon, WebinarAndSupportIcon } from '@assets/icons'

import { studentType } from '../data'

import s from './studentBlock.module.scss'

type Props<T extends studentType> = {
  student?: T
  onClick?: () => void
}
export const StudentBlock = <T extends studentType>({ student, onClick }: Props<T>) => {
  const buttonColor = student ? '#E9ECEF' : '#831f29'
  return (
    <div className={s.studentBox}>
      <div className={clsx(s.title, s.access)}>
        {!student?.name ? (
          <Input placeholder="Начните вводить ФИО студента" />
        ) : (
          <Typography variant="body_2" className={s.name}>
            {student?.name ? student.name : 'Начните вводить ФИО студента'}
          </Typography>
        )}
      </div>
      <div className={s.progress}>
        <p className={s.progress__txt}>{student?.progress ? student?.progress : 0} из 100%</p>
        <ProgressBar
          progress={student?.progress ? student?.progress : 0}
          total={100}
          progressBarClassName={s.bar}
          progressIndicatorClassName={s.indicator}
        />
      </div>

      <div className={s.btns}>
        <Button variant="secondary" className={student ? s.btn : s.btn_disPrymary}>
          <BasketIcon width={'40px'} height={'40px'} fill={buttonColor} />
        </Button>
        <Button
          variant="primary"
          className={student ? s.btn : s.btn_disSecondary}
          onClick={onClick}
        >
          <WebinarAndSupportIcon width={'24px'} height={'24px'} fill={buttonColor} />
        </Button>
      </div>
    </div>
  )
}
