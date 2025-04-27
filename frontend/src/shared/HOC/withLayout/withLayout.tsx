import { Header, Loader, Sidebar } from '@shared/components'
import { ComponentType } from 'react'

import { useFetchData } from '../useFetchData'

import s from './layout.module.scss'

export const withLayout = <T extends object>(Component: ComponentType<T>) => {
  return (props: T) => {
    const { isLoading, isMobile } = useFetchData()

    return (
      <>
        <>
          <Header />
          <div className={s.appWrapper}>
            {!isMobile && <Sidebar />}
            <main>
              <div className={s.main}>{isLoading ? <Loader /> : <Component {...props} />}</div>
            </main>
          </div>
        </>
      </>
    )
  }
}
