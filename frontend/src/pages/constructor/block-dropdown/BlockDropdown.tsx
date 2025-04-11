import { AddItemIcon, EditIcon, BasketIcon } from '@assets/icons'
import { NewItem } from '@services/slices/constructor/constructor.types'
import { DropdownCard } from '@shared/components'
import { ConstructorContent } from '@shared/components/constructorContent'
import { AddTest } from '@shared/components/constructorMenu/addTest/AddTest'

import s from './block-dropdown.module.scss'

type Props = {
  newItems: NewItem[]
  isActiveBlock: boolean
  title?: string
  onActive: () => void
  deleteBlock: () => void
  setIsSidebarPointed: (value: boolean) => void
}

export const BlockDropdown = ({
  newItems,
  isActiveBlock,
  title,
  onActive,
  deleteBlock,
  setIsSidebarPointed,
}: Props) => {
  const toggleDropdown = () => {
    onActive()
  }

  const renderItems = () => {
    return newItems.map((item) => {
      switch (item.type) {
        case 'text':
          return <ConstructorContent key={item.id} type="text" />
        case 'video':
          return <ConstructorContent key={item.id} type="video" />
        case 'image':
          return <ConstructorContent key={item.id} type="image" />
        case 'test':
          return <AddTest key={item.id} />
        default:
          return null
      }
    })
  }

  return (
    <DropdownCard
      title={title || ''}
      icons={[<EditIcon height={'12px'} width={'12px'} />, <BasketIcon onClick={deleteBlock} />]}
      wrapperClassName={s.dropdownHeader}
      className={s.dropdownContent}
      isOpen={isActiveBlock}
      toggle={toggleDropdown}
    >
      {renderItems()}
      <AddItemIcon className={s.icon} onClick={() => setIsSidebarPointed(true)} />
    </DropdownCard>
  )
}
