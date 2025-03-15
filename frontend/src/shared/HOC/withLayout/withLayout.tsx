import { Sidebar } from '@shared/components'
import Header from '@shared/components/Header/Header'
import { useScreenWidth } from '@shared/hooks/useScreenWidth'
import { ComponentType } from 'react'

import s from './layout.module.css'

export const withLayout = <T extends object>(Component: ComponentType<T>) => {
  return (props: T) => {
    const { isMobile } = useScreenWidth()

    return (
      <>
        <Header title="Корпоративный университет Транспортного комплекса" />
        <div className={s.appWrapper}>
          {!isMobile && <Sidebar />}
          <main className={s.main}>
            <Component {...props} />
          </main>
        </div>
      </>
    )
  }
}
