import { useScreenWidth } from '@shared/hooks'
import React, { useState } from 'react'

import MobileVersionHeaderIcon from '@assets/icons/MobileVersionHeaderIcon'

import LogoIcon from '../../../assets/icons/LogoIcon'
import '@fontsource/manrope/600.css'
import { Sidebar } from '../sidebar'

import styles from './header.module.scss'
import { HeaderAvatar } from './HeaderAvatar'

type HeaderProps = {
  title: string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { isMobile } = useScreenWidth()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const onToggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }
  return (
    <header className={styles.header}>
      <div className={styles.header__logoContainer}>
        <LogoIcon width={36} height={43} color="red" />
        <p className={styles.header__logoText}>
          Московский <br />
          транспорт
        </p>
      </div>
      <div className={styles.header__titleContainer}>
        <p className={styles.header__titleText}>{title}</p>
      </div>
      <HeaderAvatar />
      <MobileVersionHeaderIcon
        className={styles.header__mobileIcon}
        width={40}
        height={40}
        onClick={onToggleMobileSidebar}
      />
      {isMobile && isMobileSidebarOpen && <Sidebar />}
    </header>
  )
}

export default Header
