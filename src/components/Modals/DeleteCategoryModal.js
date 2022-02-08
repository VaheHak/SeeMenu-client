import React, { Component } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

class DeleteCategoryModal extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
    deleteCategory: PropTypes.func.isRequired,
  };

  render() {
    const { text, deleteCategory, close } = this.props;
    return (
      <Modal
        isOpen
        onRequestClose={close}
        overlayClassName="deleteCategoryModal"
      >
        <div className="deleteModal">
          <span>{text}</span>
          <div className="buttonBlock">
            <button type="button" onClick={deleteCategory}>Delete</button>
            <button type="button" onClick={close}>Close</button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default DeleteCategoryModal;
