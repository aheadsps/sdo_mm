import { CalendarIcon } from '@assets/icons'
import clsx from 'clsx'
import React from 'react'
import { CustomProvider, DatePicker } from 'rsuite'
import ruRU from 'rsuite/locales/ru_RU'

import s from './date-picker-custom.module.scss'

interface DatePickerCustomProps {
  placeholder: string
  appearance?: 'default' | 'subtle'
  className?: string
  value?: Date | null
  onChange?: (date: Date | null) => void
}

export const DatePickerCustom: React.FC<DatePickerCustomProps> = ({
  placeholder,
  appearance = 'subtle',
  className,
  value,
  onChange,
  ...rest
}) => {
  return (
    <CustomProvider locale={ruRU}>
      <DatePicker
        className={clsx(s.datePicker, className)}
        placeholder={placeholder}
        appearance={appearance}
        caretAs={CalendarIcon}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </CustomProvider>
  )
}
