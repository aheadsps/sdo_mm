import { zodResolver } from '@hookform/resolvers/zod'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { handleError } from '@shared/utils'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useLoginMutation } from '../api'
import { authFormSchema } from '../ui/authFormSchema'

import { AuthFormData } from './types'

export const useAuthForm = () => {
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

  return {
    onSubmit: handleSubmit(onFormSubmit),
    showPassword,
    errorMessage,
    register,
    errors,
    isSubmitting,
    isValid,
    setShowPassword,
  }
}
