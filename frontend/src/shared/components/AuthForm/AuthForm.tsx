import { Link } from 'react-router-dom'

import styles from '../AuthForm/authform.module.scss'
import { Typography } from '../Typography'

const AuthForm = () => {
  return (
    <div className={styles.auth}>
      <div className={styles.auth__container}>
        <Typography className={styles.auth__heading} variant={'header_3'}>
          Авторизация
        </Typography>
        <div className={styles.auth__inputs}>
          <input type="email" className={styles.auth__input} placeholder="Email" />
          <input type="password" className={styles.auth__input} placeholder="Пароль" />
        </div>
        <div className={styles.auth__links}>
          <Link to="/forgot-password" className={styles.auth__link}>
            Забыли пароль?
          </Link>
          <Link to="/signup" className={styles.auth__link}>
            Регистрация
          </Link>
        </div>
        <button className={styles.auth__button}>Войти</button>
      </div>
    </div>
  )
}

export default AuthForm
