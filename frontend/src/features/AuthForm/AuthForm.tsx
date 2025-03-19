import styles from '@features/AuthForm/authform.module.scss'
import { Button } from '@shared/components'
import { Input } from '@shared/components/input/Input'
import { Typography } from '@shared/components/Typography'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { ClosedEyeIcon, OpenedEyeIcon } from '@assets/icons'

interface AuthFormData {
  email: string
  password: string
}

const AuthForm = () => {
  const { register, handleSubmit, formState, reset } = useForm<AuthFormData>({
    mode: 'onChange',
    delayError: 2000,
  })

  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = (data: AuthFormData) => {
    console.log(data)
    reset()
  }

  return (
    <div className={styles.auth}>
      <form className={styles.auth__container} onSubmit={handleSubmit(onSubmit)}>
        <Typography className={styles.auth__heading} variant={'header_3'}>
          Авторизация
        </Typography>
        <div className={styles.auth__inputs}>
          <Input
            type="text"
            className={`${styles.auth__input} ${formState.errors.email ? styles.auth__inputError : ''}`}
            placeholder="Email"
            required
            {...register('email', {
              required: 'Заполните все поля',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Некорректный email',
              },
            })}
          />
          {formState.errors.email && (
            <span className={styles.auth__error}>{formState.errors.email.message}</span>
          )}
          <div className={styles.auth__passwordWrapper}>
            <Input
              type={showPassword ? 'text' : 'password'}
              className={`${styles.auth__input} ${formState.errors.password ? styles.auth__inputError : ''}`}
              placeholder="Пароль"
              required
              {...register('password', {
                required: 'Заполните все поля',
                minLength: {
                  value: 6,
                  message: 'Минимум 6 символов',
                },
              })}
            />
            <div
              className={styles.auth__eyeIconWrapper}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <OpenedEyeIcon className={styles.auth__eyeIcon} width={18} height={18} />
              ) : (
                <ClosedEyeIcon className={styles.auth__eyeIcon} width={18} height={18} />
              )}
            </div>
          </div>
          {formState.errors.password && (
            <span className={styles.auth__error}>{formState.errors.password.message}</span>
          )}
        </div>
        <div className={styles.auth__links}>
          <Link to="/forgot-password" className={styles.auth__link}>
            Забыли пароль?
          </Link>
          <Link to="/signup" className={styles.auth__link}>
            Восстановить
          </Link>
        </div>
        <Button className={styles.auth__button}>Войти</Button>
      </form>
    </div>
  )
}

export default AuthForm
