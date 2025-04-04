// import { Button, ProgressBar } from '@shared/components'

// import { BasketIcon, WebinarAndSupportIcon } from '@assets/icons'

// import s from './studentBlock.module.scss'

// export const StudentBlock = () => {
//   return (
//     <div className={s.box}>
//       <div className={s.name}>Кузнецов Евгений Андреевич</div>
//       <div className={s.content}>
// <div className={s.progress}>
//   <p className={s.progress__txt}>20 из 100%</p>
//   <ProgressBar
//     progress={40}
//     total={100}
//     progressBarClassName={s.bar}
//     progressIndicatorClassName={s.indicator}
//   />
// </div>
// <div className={s.btns}>
//   <Button variant="secondary" className={s.btn}>
//     <BasketIcon width={'40px'} height={'40px'} />
//   </Button>
//   <Button variant="primary" className={s.btn}>
//     <WebinarAndSupportIcon width={'24px'} height={'24px'} />
//   </Button>
// </div>
//       </div>
//     </div>
//   )
// }

import { Button, Input, type Option, ProgressBar, Typography } from '@shared/components'
import { useToggle } from '@shared/hooks'
import clsx from 'clsx'

import { BasketIcon, WebinarAndSupportIcon } from '@assets/icons'

import { LessonType } from '../../course/program/data'

import s from './studentBlock.module.scss'

type Props<T extends LessonType> = {
  student?: T
  optionsDate?: Option[]
  optionsFormat?: Option[]
  isExpandableContent?: boolean
}
export const StudentBlock = <T extends LessonType>({
  student,
  // optionsFormat,
  // isExpandableContent = false,
}: Props<T>) => {
  return (
    <div className={s.lessonContent}>
      <div className={clsx(s.title, s.access)}>
        {!student?.name? (
          <Input placeholder="Начните вводить ФИО студента" />
        ) : (
          <Typography variant="body_2" className={s.name}>
            {student?.name ? student.name : 'Начните вводить ФИО студента'}
          </Typography>
        )}
      </div>
      {/* {isExpandableContent ? (
        <>
          <Select
            className={clsx(s.date, s.access)}
            placeholder={'Выберите доступ'}
            options={optionsFormat}
          />
        </>
      ) : (
        <> */}
      <div className={s.progress}>
        <p className={s.progress__txt}>20 из 100%</p>
        <ProgressBar
          progress={40}
          total={100}
          progressBarClassName={s.bar}
          progressIndicatorClassName={s.indicator}
        />
      </div>

      <div className={s.btns}>
        <Button variant="secondary" className={s.btn}>
          <BasketIcon width={'40px'} height={'40px'} />
        </Button>
        <Button variant="primary" className={s.btn}>
          <WebinarAndSupportIcon width={'24px'} height={'24px'} />
        </Button>
      </div>
      {/* </>
      )} */}
    </div>
  )
}
