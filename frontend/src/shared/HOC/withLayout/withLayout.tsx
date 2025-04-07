import { Sidebar, Header } from '@shared/components'
import Loader from '@shared/components/loader/Loader'
import { useScreenWidth } from '@shared/hooks'
import { ComponentType, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import s from './layout.module.scss'

export const withLayout = <T extends object>(Component: ComponentType<T>) => {
  return (props: T) => {
    const path = useLocation()
    const { isMobile } = useScreenWidth()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const timerId = setTimeout(() => {
        setIsLoading(false)
      }, 1000)

      return () => {
        clearTimeout(timerId)
      }
    }, [])

    return (
      <>
        <Header />
        {path.pathname.includes('/constructor') ? (
          <div className={s.constructorWrapper}>
            {isLoading ? <Loader /> : <Component {...props} />}
          </div>
        ) : (
          <div className={s.appWrapper}>
            {!isMobile && <Sidebar />}
            <main>
              <div className={s.main}>{isLoading ? <Loader /> : <Component {...props} />}</div>
            </main>
          </div>
        )}
      </>
    )
  }
}
