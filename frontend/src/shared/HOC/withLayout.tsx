import { Sidebar } from '@shared/components'
import { ComponentType } from 'react'

import s from './layout.module.css'

export const withLayout = <T extends object>(Component: ComponentType<T>) => {
  return (props: T) => {
    return (
      <>
        <header className={s.header}>Hello</header>
        <Sidebar />
        <Component {...props} />
      </>
    )
  }
}
