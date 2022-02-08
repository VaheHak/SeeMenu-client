import React, { Component } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import Input from '../Inputs/Input';

class EditUsersModal extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    formData: PropTypes.object.isRequired,
    change: PropTypes.func.isRequired,
  };

  render() {
    const {
      close, updateUser, errors, change, formData,
    } = this.props;
    return (
      <Modal
        isOpen
        onRequestClose={close}
        overlayClassName="usersModal"
      >
        <div className="editUserModal">
          <h3 className="processName">Account information</h3>
          <div className="inputsBlock">
            <Input
              className="inputArea"
              label="Name"
              type="text"
              helperText={errors?.firstName}
              onChange={(ev) => change(ev.target.value, 'firstName')}
              value={formData.firstName}
            />
            <Input
              className="inputArea"
              label="Surname"
              type="text"
              helperText={errors?.lastName}
              onChange={(ev) => change(ev.target.value, 'lastName')}
              value={formData.lastName}
            />
            <Input
              className="inputArea"
              label="Phone"
              type="tel"
              helperText={errors?.phone}
              onChange={(ev) => change(ev.target.value, 'phone')}
              value={formData.phone}
            />
            <Input
              className="inputArea"
              label="Email"
              type="email"
              helperText={errors?.email}
              onChange={(ev) => change(ev.target.value, 'email')}
              value={formData.email}
            />
          </div>
          <div className="buttonBlock">
            <button onClick={updateUser}>Update</button>
            <button onClick={close}>Close</button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default EditUsersModal;
