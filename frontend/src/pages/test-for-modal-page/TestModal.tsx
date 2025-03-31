import { Button, Modal, ProgressBar } from '@shared/components'
import { withLayout } from '@shared/HOC'
import { useToggle } from '@shared/hooks/useToggle'

import s from './example.module.scss'

const Test = () => {
  const { isOpen: isOpenModal, close: closeModal, open: openModal } = useToggle()
  return (
    <>
      <Button onClick={openModal}>Open Modal</Button>
      <ProgressBar
        progress={2}
        total={4}
        progressBarClassName={s.progressBar}
        progressIndicatorClassName={s.progressIndicator}
      />
      {isOpenModal && (
        <Modal close={closeModal} title="Modal Window">
          Hello Modal
        </Modal>
      )}
    </>
  )
}

export const TestModal = withLayout(Test)
