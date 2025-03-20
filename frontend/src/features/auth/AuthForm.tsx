import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Typography, Input } from '@shared/components'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { ClosedEyeIcon, OpenedEyeIcon } from '@assets/icons'

import styles from './auth-form.module.scss'
import { authFormSchema } from './authFormSchema'

interface AuthFormData {
  email: string
  password: string
}

export const AuthForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<AuthFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(authFormSchema),
    mode: 'onBlur',
  })

  const [showPassword, setShowPassword] = useState(false)

  const onFormSubmit = (data: AuthFormData) => {
    console.log(data)
    reset()
  }

  return (
    <div className={styles.auth}>
      <form className={styles.auth__container} onSubmit={(e) => void handleSubmit(onFormSubmit)(e)}>
        <Typography className={styles.auth__heading} variant={'header_3'}>
          Авторизация
        </Typography>
        <div className={styles.auth__inputs}>
          <Input
            type="text"
            className={`${styles.auth__input} ${errors.email ? styles.auth__inputError : ''}`}
            placeholder="Email"
            required
            {...register('email')}
          />
          {errors.email && <span className={styles.auth__error}>{errors.email.message}</span>}
          <div className={styles.auth__passwordWrapper}>
            <Input
              type={showPassword ? 'text' : 'password'}
              className={`${styles.auth__input} ${errors.password ? styles.auth__inputError : ''}`}
              placeholder="Пароль"
              required
              {...register('password')}
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
          {errors.password && <span className={styles.auth__error}>{errors.password.message}</span>}
        </div>
        <div className={styles.auth__links}>
          <Link to="/forgot-password" className={styles.auth__link}>
            Забыли пароль?
          </Link>
          <Link to="/signup" className={styles.auth__link}>
            Восстановить
          </Link>
        </div>
        <Button className={styles.auth__button} disabled={!isValid || isSubmitting}>
          Войти
        </Button>
      </form>
    </div>
  )
}
