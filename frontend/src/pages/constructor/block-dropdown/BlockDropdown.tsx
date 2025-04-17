import { AddItemIcon, BasketIcon, CopyIcon } from '@assets/icons'
import { NewItem } from '@services/slices/constructor/constructor.types'
import { DropdownCard } from '@shared/components'
import { ConstructorContent } from '@shared/components/constructorContent'
import { ChangeEvent, useState } from 'react'

import s from './block-dropdown.module.scss'

type Props = {
  blockId: number
  newItems: NewItem[]
  isActiveBlock: boolean
  title?: string
  onActive: (blockId: number) => void
  deleteBlock: () => void
  setIsSidebarPointed: (value: boolean) => void
}

export const BlockDropdown = ({
  blockId,
  newItems,
  isActiveBlock,
  title,
  onActive,
  deleteBlock,
  setIsSidebarPointed,
}: Props) => {
  const [blockTitle, setBlockTitle] = useState('')

  const toggleDropdown = () => {
    onActive(blockId)
  }

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBlockTitle(e.currentTarget.value)
  }

  return (
    <DropdownCard
      title={title || ''}
      icons={[
        <CopyIcon height="16px" width="16px" />,
        <BasketIcon height="16px" width="16px" onClick={deleteBlock} />,
      ]}
      wrapperClassName={s.dropdownHeader}
      className={s.dropdownContent}
      isOpen={isActiveBlock}
      toggle={toggleDropdown}
      value={blockTitle}
      onChange={onTitleChange}
    >
      {newItems.map((item) => (
        <ConstructorContent key={item.id} type={item.type} itemId={item.id as number} />
      ))}
      {!newItems.length && (
        <AddItemIcon className={s.icon} onClick={() => setIsSidebarPointed(true)} />
      )}
    </DropdownCard>
  )
}
