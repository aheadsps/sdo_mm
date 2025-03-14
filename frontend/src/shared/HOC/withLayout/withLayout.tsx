import { Sidebar } from '@shared/components'
import Header from '@shared/components/Header/Header'
import { ComponentType } from 'react'

import s from './layout.module.css'

export const withLayout = <T extends object>(Component: ComponentType<T>) => {
  return (props: T) => {
    return (
      <>
        {/* <header className={s.header}>Hello</header> */}
        <Header title="Корпоративный университет Транспортного комплекса" />
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
