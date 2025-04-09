import { ArrowDownIcon, ArrowUpIcon } from '@assets/icons'
import { useToggle } from '@shared/hooks/useToggle'
import clsx from 'clsx'
import { useState } from 'react'

import { Typography } from '../typography'

import styles from './Select.module.scss'

export type Option = {
  id: number
  value: string
}

type Props = {
  options?: Option[]
  placeholder?: string
  className?: string
  border?: string
  isCalendar?: boolean
}

export const Select = ({ options, placeholder = 'Выбрать', className, border }: Props) => {
  const { isOpen, toggle, close } = useToggle()
  const [selected, setSelected] = useState<Option | null>(null)

  const handleSelect = (option: Option) => {
    setSelected(option)
    close()
  }

  return (
    <div className={clsx(styles.selectContainer, className)}>
      <div
        className={clsx(styles.selectBox, border)}
        onClick={toggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        role="button"
        tabIndex={0}
        aria-label={placeholder}
      >
        <Typography
          className={selected ? styles.selectedText : styles.placeholder}
          variant="body_1"
        >
          {selected ? selected.value : placeholder}
        </Typography>
        {isOpen ? (
          <ArrowUpIcon width={'12px'} height={'12px'} />
        ) : (
          <ArrowDownIcon width={'12px'} height={'12px'} />
        )}
      </div>

      {isOpen && options && (
        <div className={styles.dropdown} role="listbox" aria-labelledby="select-dropdown">
          {options?.map((option) => (
            <div
              key={option.value}
              className={`${styles.option} ${selected?.value === option.value ? styles.selected : ''}`}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={selected?.value === option.value}
              tabIndex={0}
            >
              {option.value}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
