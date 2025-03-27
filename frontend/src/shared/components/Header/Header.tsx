import React, { useState } from 'react'

import '@fontsource/manrope/600.css'
import { Sidebar } from '../sidebar'
import { Typography } from '../typography'

import styles from './header.module.scss'
import { HeaderAvatar } from './HeaderAvatar'

import { LogoIcon, MobileVersionHeaderIcon } from '@/assets/icons'
import { useAppSelector } from '@/services'
import { selectIsAuth } from '@/services/auth/authSlice'
import { useScreenWidth } from '@/shared/hooks'

const Header: React.FC = () => {
  const isAuth = useAppSelector(selectIsAuth)
  const { isMobile } = useScreenWidth()

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const onToggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }
  return (
    <header className={styles.header}>
      <div className={styles.header__content}>
        <div className={styles.header__logoContainer}>
          <LogoIcon width={36} height={43} color="red" />
          <p className={styles.header__logoText}>
            Московский <br />
            транспорт
          </p>
        </div>
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
