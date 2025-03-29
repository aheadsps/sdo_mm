import { useToggle } from '@shared/hooks/useToggle'
import { useState } from 'react'

import { ArrowDownIcon, ArrowUpIcon } from '@assets/icons'

import { Typography } from '../typography'

import styles from './Select.module.scss'

type Option = {
  label: string
  value: string
}

type Props = {
  options: Option[]
  placeholder?: string
}

const Select = ({ options, placeholder = 'Выбрать' }: Props) => {
  const { isOpen, toggle, close } = useToggle()
  const [selected, setSelected] = useState<Option | null>(null)

  const handleSelect = (option: Option) => {
    setSelected(option)
    close()
  }

  return (
    <div className={styles.selectContainer}>
      <div
        className={styles.selectBox}
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
          {selected ? selected.label : placeholder}
        </Typography>
        {isOpen ? (
          <ArrowUpIcon width={'12px'} height={'12px'} />
        ) : (
          <ArrowDownIcon width={'12px'} height={'12px'} />
        )}
      </div>
      {isOpen && (
        <div className={styles.dropdown} role="listbox" aria-labelledby="select-dropdown">
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.option} ${selected?.value === option.value ? styles.selected : ''}`}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={selected?.value === option.value}
              tabIndex={0}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Select
