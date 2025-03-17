import React from 'react'

import MobileVersionHeaderIcon from '@assets/icons/MobileVersionHeaderIcon'

import LogoIcon from '../../../assets/icons/LogoIcon'

import '@fontsource/manrope/600.css'
import styles from './header.module.scss'
import { HeaderAvatar } from './HeaderAvatar'

const Header: React.FC = () => {
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
        <p className={styles.header__titleText}>
          Корпоративный университет Транспортного комплекса
        </p>
      </div>
      <HeaderAvatar />
      <MobileVersionHeaderIcon className={styles.header__mobileIcon} width={40} height={40} />
    </header>
  )
}

export default Header
