import { useTranslation } from 'next-i18next'
import { Text, Button, Modal } from '@nextui-org/react';

export default function ComponentHandler({ children, title, visible, setVisible, onSubmitHandler }) {
  const { t } = useTranslation('common');

  const closeHandler = () => {
    setVisible(false);
  };

  return (
    
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
        blur
        css={{ margin: 10 }}
      >
        <form onSubmit={onSubmitHandler}>
        <Modal.Header>
          <Text h3 >
            {title}
          </Text>
        </Modal.Header>
        <Modal.Body>
          {children}
        </Modal.Body>
        <Modal.Footer>
          <Button auto shadow color="error" onClick={closeHandler}>Close</Button>
          {onSubmitHandler && <Button auto type='submit'>Save</Button>}
        </Modal.Footer>
        </form>
      </Modal>
  )
}
