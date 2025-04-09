import { OpenedEyeIcon, ClosedEyeIcon } from '@assets/icons'
import { Typography, Button } from '@shared/components'
import { Link } from 'react-router-dom'

import { useAuthForm } from '../model/useAuthForm'

import styles from './auth-form.module.scss'
import { FormInput } from './FormInput'

export const AuthForm = () => {
  const { onSubmit, showPassword, setShowPassword, isValid, isSubmitting, control, authError } =
    useAuthForm()

  return (
    <div className={styles.auth}>
      <form className={styles.auth__container} onSubmit={(e) => void onSubmit(e)}>
        <Typography className={styles.auth__heading} variant={'header_3'}>
          Авторизация
        </Typography>

        <div className={styles.auth__inputs}>
          <FormInput name="email" control={control} type="text" placeholder="Email" />
          <div className={styles.auth__passwordWrapper}>
            <FormInput
              name="password"
              control={control}
              type={showPassword ? 'text' : 'password'}
              placeholder="Пароль"
            >
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
            </FormInput>
          </div>
        </div>

        <div className={styles.auth__links}>
          <Link to="/forgot-password" className={styles.auth__link}>
            Забыли пароль?
          </Link>
          <Link to="/signup" className={styles.auth__link}>
            Восстановить
          </Link>
        </div>
        {authError && (
          <Typography className={styles.error} variant="body_1">
            {authError}
          </Typography>
        )}
        <Button className={styles.auth__button} disabled={!isValid || isSubmitting}>
          Войти
        </Button>
      </form>
    </div>
  )
}
