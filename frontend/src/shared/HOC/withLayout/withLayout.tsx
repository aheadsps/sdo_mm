import { Sidebar } from '@shared/components'
import { ComponentType } from 'react'

import s from './layout.module.css'

export const withLayout = <T extends object>(Component: ComponentType<T>) => {
  return (props: T) => {
    return (
      <>
        <header className={s.header}>Hello</header>
        <div className={s.appWrapper}>
          <Sidebar />
          <main className={s.main}>
            <Component {...props} />
          </main>
        </div>
      </>
    )
  }
}
