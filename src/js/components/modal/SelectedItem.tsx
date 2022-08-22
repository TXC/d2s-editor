import * as React from 'react'
import {Button, Modal} from 'react-bootstrap'
import ItemEditor from '../inventory/ItemEditor'
import {onEvent, Hook} from '../App'

type SelectedItemModalProps = {
  hook: Hook
  callOnEvent: onEvent
}
const SelectedItem = ({hook, callOnEvent}: SelectedItemModalProps) => {

  const handleClose = () => {
    if (!hook.selected.selected) {
      return
    }
    callOnEvent({ item: hook.selected.selected, type: 'update' })
    hook.selected.setSelected(null)
  }
  const id = React.useId()

  const click = (action: string) => {
    if (!hook.selected.selected) {
      return
    }
    callOnEvent({type: action, item: hook.selected.selected })
    hook.selected.setSelected(null)
  }

  return (
    <Modal
      animation={false}
      size="lg"
      show={hook.selected.selected !== null}
      onHide={handleClose}
      dialogClassName={hook.theme.isThemed ? 'theme-d2' : ''}
    >
      <Modal.Header closeButton>
        <Modal.Title>Selected Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {hook.selected.selected !== null && (
          <ItemEditor
            id={id}
            item={hook.selected.selected}
            setSelected={hook.selected.setSelected}
            setLocation={hook.location.setLocation}
            location={hook.location.location}
            callOnEvent={callOnEvent}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        { hook.selected.selected !== null && (
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => { click('share') }}
            >Share</button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => { click('copy') }}
            >Copy</button>
            { hook.selected.selected.location_id !== 6 && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => { click('delete') }}
              >Delete</button>
            )}
          </div>
        )}
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SelectedItem
