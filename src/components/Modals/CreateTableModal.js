import React, { Component } from 'react';
import Modal from 'react-modal';
import { Close } from '@material-ui/icons';
import PropTypes from 'prop-types';
import TableCreate from '../Create/TableCreate';

class CreateTableModal extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    tableProcess: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired,
  };

  render() {
    const {
      close,
      tableProcess,
      button,
    } = this.props;
    return (
      <>
        <Modal
          isOpen
          onRequestClose={close}
          overlayClassName="createTableModal"
        >
          <div className="createTable">
            <div className="closeTableBlock">
              <span>{tableProcess}</span>
              <div className="closeButton">
                <Close onClick={close} />
              </div>
            </div>
            <div className="tableInputBlock">
              <TableCreate
                button={button}
                close={close}
              />
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default CreateTableModal;
