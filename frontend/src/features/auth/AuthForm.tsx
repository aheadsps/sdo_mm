import { zodResolver } from '@hookform/resolvers/zod'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { Button, Typography, Input } from '@shared/components'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { ClosedEyeIcon, OpenedEyeIcon } from '@assets/icons'

import { handleError } from '../../shared/utils/handleError'

import { useLoginMutation } from './api/auth.api'
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [login] = useLoginMutation()
  const navigate = useNavigate()

  const onFormSubmit = async (data: AuthFormData) => {
    try {
      const res = await login(data).unwrap()
      if (res.token) {
        localStorage.setItem('token', res.token)
      }
      reset()
      await navigate('/main', { replace: true })
    } catch (err) {
      const error = handleError(err as FetchBaseQueryError | SerializedError)
      setErrorMessage(error as string)
    }
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
        {errorMessage && (
          <Typography className={styles.error} variant="body_1">
            {errorMessage}
          </Typography>
        )}
        <Button className={styles.auth__button} disabled={!isValid || isSubmitting}>
          Войти
        </Button>
      </form>
    </div>
  )
}
