import { Sidebar, Header } from '@shared/components'
import { useScreenWidth } from '@shared/hooks'
import { ComponentType } from 'react'

import s from './layout.module.scss'

export const withLayout = <T extends object>(Component: ComponentType<T>) => {
  return (props: T) => {
    const { isMobile } = useScreenWidth()

    return (
      <>
        <Header />
        <div className={s.appWrapper}>
          {!isMobile && <Sidebar />}
          <main>
            <div className={s.main}>
              <Component {...props} />
            </div>
          </main>
        </div>
      </>
    )
  }
}
