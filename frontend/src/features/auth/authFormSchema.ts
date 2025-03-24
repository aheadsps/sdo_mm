import { z } from 'zod'

export const authFormSchema = z.object({
  email: z.string().nonempty('Заполните все поля').email('Некорректный email'),

  password: z.string().nonempty('Заполните все поля').min(8, 'Минимум 8 символов'),
})
