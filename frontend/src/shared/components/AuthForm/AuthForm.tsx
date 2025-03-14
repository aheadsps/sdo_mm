import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import styles from '../AuthForm/authform.module.scss'
import { Typography } from '../Typography'

interface AuthFormData {
  email: string
  password: string
}

const AuthForm = () => {
  const { register, handleSubmit, formState } = useForm<AuthFormData>({
    mode: 'onChange',
    delayError: 2000,
  })

  const onSubmit = (data: AuthFormData) => {
    console.log(data)
  }

  return (
    <div className={styles.auth}>
      <form className={styles.auth__container} onSubmit={handleSubmit(onSubmit)}>
        <Typography className={styles.auth__heading} variant={'header_3'}>
          Авторизация
        </Typography>
        <div className={styles.auth__inputs}>
          <input
            type="email"
            className={styles.auth__input}
            placeholder="Email"
            required
            {...register('email', {
              required: '*Заполните все поля',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Введите корректный адрес эл. почты',
              },
            })}
          />
          {/* Отображение ошибки для email */}
          {formState.errors.email && (
            <span className={styles.auth__error}>{formState.errors.email.message}</span>
          )}
          <input
            type="password"
            className={styles.auth__input}
            placeholder="Пароль"
            required
            {...register('password', {
              required: '*Заполните все поля',
              minLength: {
                value: 6,
                message: 'Неверный логин или пароль',
              },
            })}
          />
          {/* Отображение ошибки для пароля */}
          {formState.errors.password && (
            <span className={styles.auth__error}>{formState.errors.password.message}</span>
          )}
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
      </form>
    </div>
  )
}

export default AuthForm
