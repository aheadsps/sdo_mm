import { Button, Modal } from '@shared/components'
import { withLayout } from '@shared/HOC'
import { useToggle } from '@shared/hooks/useToggle'

const Test = () => {
  const { isOpen: isOpenModal, close: closeModal, open: openModal } = useToggle()
  return (
    <>
      <Button onClick={openModal}>Open Modal</Button>
      {isOpenModal && (
        <Modal close={closeModal} title="Modal Window">
          Hello Modal
        </Modal>
      )}
    </>
  )
}

export const TestModal = withLayout(Test)
