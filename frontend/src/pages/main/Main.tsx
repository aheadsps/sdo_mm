import { Task } from '@features/main'
import { Typography } from '@shared/components'
import { withLayout } from '@shared/HOC/withLayout'

import s from './main.module.scss'

const MainComp = () => {
  return (
    <main className={s.main}>
      <Typography variant="header_4" className={s.title}>
        Ваши актуальные задачи
      </Typography>
      <Task daysLeft={2} />
      <Task daysLeft={4} />
      <Task daysLeft={7} />
      <Task />
    </main>
  )
}

export const Main = withLayout(MainComp)
