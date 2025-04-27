import { LogoIcon, MobileVersionHeaderIcon } from '@assets/icons'
import { routes } from '@routes/routes'
import { selectIsAuth } from '@services/slices'
import { useAppSelector } from '@services/store'
import { useScreenWidth } from '@shared/hooks'
import { useState } from 'react'
import '@fontsource/manrope/600.css'
import { NavLink } from 'react-router-dom'

import { Sidebar } from '../sidebar'
import { Typography } from '../typography'

import styles from './header.module.scss'
import { HeaderAvatar } from './HeaderAvatar'

const Header = () => {
  const isAuth = useAppSelector(selectIsAuth)
  const { isMobile } = useScreenWidth()

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const onToggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }
  return (
    <header className={styles.header}>
      <div className={styles.header__content}>
        <NavLink className={styles.logoContainer} to={routes.main}>
          <LogoIcon width={36} height={43} color="red" />
          <p className={styles.header__logoText}>
            Московский <br />
            транспорт
          </p>
        </NavLink>
        <div className={styles.header__titleContainer}>
          <Typography className={styles.header__titleText} variant={'header_6'}>
            Корпоративный университет Транспортного комплекса
          </Typography>
        </div>
        {isAuth && <HeaderAvatar />}
        <MobileVersionHeaderIcon
          className={styles.header__mobileIcon}
          width={40}
          height={40}
          onClick={onToggleMobileSidebar}
        />
      </div>
      {isMobile && <Sidebar className={isMobileSidebarOpen ? styles.open : ''} />}
    </header>
  )
}

export default Header
