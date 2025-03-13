import { withLayout } from '@shared/HOC/withLayout'

import s from './main.module.css'

const MainComp = () => {
  return <main className={s.main}>Hello Main</main>
}

export const Main = withLayout(MainComp)
