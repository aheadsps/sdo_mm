import { Task } from '@features/main'
import { Typography } from '@shared/components'
import { withLayout } from '@shared/HOC/withLayout'

import s from './main.module.scss'

const MainComp = () => {
  return (
    <>
      <Typography variant="header_4" className={s.title}>
        Ваши актуальные задачи
      </Typography>
      <Task daysLeft={2} />
      <Task daysLeft={4} />
      <Task daysLeft={7} />
      <Task />
    </>
  )
}

export const Main = withLayout(MainComp)
