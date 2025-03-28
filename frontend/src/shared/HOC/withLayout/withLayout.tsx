import { ComponentType, useEffect, useState } from 'react'

import s from './layout.module.scss'

import { Header, Sidebar, Loader } from '@/shared/components'
import { useScreenWidth } from '@/shared/hooks'

export const withLayout = <T extends object>(Component: ComponentType<T>) => {
  return (props: T) => {
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
        <div className={s.appWrapper}>
          {!isMobile && <Sidebar />}
          <main>
            <div className={s.main}>{isLoading ? <Loader /> : <Component {...props} />}</div>
          </main>
        </div>
      </>
    )
  }
}
