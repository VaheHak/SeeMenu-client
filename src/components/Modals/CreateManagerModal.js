import React, { Component } from 'react';
import Modal from 'react-modal';
import { Close } from '@material-ui/icons';
import PropTypes from 'prop-types';
import ManagerCreate from '../Create/ManagerCreate';

class CreateManagerModal extends Component {
  static propTypes = {
    process: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
    rest: PropTypes.bool.isRequired,
    em: PropTypes.bool.isRequired,
  };

  render() {
    const {
      close, rest, em, process,
    } = this.props;
    return (
      <Modal
        isOpen
        onRequestClose={close}
        overlayClassName="createManagerModal"
      >
        <div className="createManager">
          <div className="closeManagerBlock">
            <span>{process}</span>
            <div className="closeButton" onClick={close}>
              <Close />
            </div>
          </div>
          <ManagerCreate
            rest={rest}
            em={em}
            close={close}
          />
        </div>
      </Modal>
    );
  }
}

export default CreateManagerModal;
