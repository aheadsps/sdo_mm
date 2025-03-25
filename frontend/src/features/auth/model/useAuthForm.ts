import { useLoginMutation } from '@app/api'
import { zodResolver } from '@hookform/resolvers/zod'
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
  const navigate = useNavigate()

  const [login, { error }] = useLoginMutation()

  const onSubmit: SubmitHandler<AuthFormData> = async (data) => {
    const res = await login(data).unwrap()
    if (res && res.token) {
      localStorage.setItem('token', res.token)
      reset()
      await navigate('/main', { replace: true })
    }
  }

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
  }
}
