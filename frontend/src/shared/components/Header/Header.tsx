import React, { useState } from 'react'

import '@fontsource/manrope/600.css'
import { Sidebar } from '../sidebar'
import { Typography } from '../typography'

import styles from './header.module.scss'
import { HeaderAvatar } from './HeaderAvatar'

import { LogoIcon, MobileVersionHeaderIcon } from '@/assets/icons'
import { useScreenWidth } from '@/shared/hooks'

const Header: React.FC = () => {
  const [isLoggedIn] = useState()

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const { isMobile } = useScreenWidth()

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
        {isLoggedIn && <HeaderAvatar />}
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
