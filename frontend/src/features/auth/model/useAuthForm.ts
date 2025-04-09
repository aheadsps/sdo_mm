import { zodResolver } from '@hookform/resolvers/zod'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useLoginMutation } from '@services/api'
import { handleError } from '@shared/utils'
import { useCallback, useState } from 'react'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { authFormSchema } from '../ui/authFormSchema'

import { AuthFormData } from './types'

export const useAuthForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    control,
    watch,
  } = useForm<AuthFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(authFormSchema),
    mode: 'onBlur',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const navigate = useNavigate()

  const [login, { error }] = useLoginMutation()

  const onSubmit: SubmitHandler<AuthFormData> = async (data) => {
    try {
      const res = await login(data).unwrap()
      if (res && res.token) {
        localStorage.setItem('token', res.token)

        reset()
        await navigate('/main', { replace: true })
      }
    } catch (err) {
      setAuthError(handleError(err as FetchBaseQueryError | SerializedError))
    }
  }

  const clearAuthError = useCallback(() => setAuthError(null), [])

  useEffect(() => {
    const subscription = watch(() => {
      clearAuthError()
    })
    return () => subscription.unsubscribe()
  }, [watch, clearAuthError])

  return {
    onSubmit: handleSubmit(onSubmit),
    showPassword,
    register,
    errors,
    isSubmitting,
    isValid,
    setShowPassword,
    control,
    error,
    authError,
  }
}
