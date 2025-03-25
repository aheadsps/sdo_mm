import { useLoginMutation } from '@app/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { handleError } from '@shared/utils'
import { useState } from 'react'
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
  const navigate = useNavigate()

  const [login] = useLoginMutation()

  const onSubmit: SubmitHandler<AuthFormData> = async (data) => {
    try {
      const res = await login(data).unwrap()
      if (res && res.token) {
        localStorage.setItem('token', res.token)
      }
      reset()
      await navigate('/main', { replace: true })
    } catch (err) {
      const error = handleError(err as FetchBaseQueryError | SerializedError)
      setErrorMessage(error)
    }
  }

  return {
    onSubmit: handleSubmit(onSubmit),
    showPassword,
    errorMessage,
    register,
    errors,
    isSubmitting,
    isValid,
    setShowPassword,
    control,
  }
}
