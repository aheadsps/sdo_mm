import React from 'react'

import LogoIcon from '../../../assets/icons/LogoIcon'

import '@fontsource/manrope/600.css'
import styles from './header.module.css'

type HeaderProps = {
  title: string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className={styles.header}>
      <div className={styles.logo__container}>
        <LogoIcon width={36} height={43} color="red" />
        <p className={styles.logo__text}>
          Московский <br />
          транспорт
        </p>
      </div>
      <div className={styles.title__container}>
        <p className={styles.title__text}>{title}</p>
      </div>
    </header>
  )
}

export default Header
