import React, { useState } from 'react'

import MobileVersionHeaderIcon from '@assets/icons/MobileVersionHeaderIcon'

import LogoIcon from '../../../assets/icons/LogoIcon'

import '@fontsource/manrope/600.css'
import styles from './header.module.scss'
import { HeaderAvatar } from './HeaderAvatar'

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
          <p className={styles.header__titleText}>
            Корпоративный университет Транспортного комплекса
          </p>
        </div>
        {isLoggedIn && <HeaderAvatar />}
        <MobileVersionHeaderIcon className={styles.header__mobileIcon} width={40} height={40} />
      </div>
    </header>
  );
};


export default Header
