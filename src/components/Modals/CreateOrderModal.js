import React, { Component } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import OrderQr from '../../pages/OrderQr';

class CreateOrderModal extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    order: PropTypes.object.isRequired,
    viewOrder: PropTypes.bool.isRequired,
    orderHistoryOpen: PropTypes.bool.isRequired,
  };

  render() {
    const {
      close,
      order,
      viewOrder,
      orderHistoryOpen,
    } = this.props;

    return (
      <>
        <Modal
          isOpen
          onRequestClose={close}
          overlayClassName="createOrderModal"
        >
          <OrderQr
            close={close}
            orderQr={order}
            viewOrder={viewOrder}
            orderHistoryOpen={orderHistoryOpen}
          />
        </Modal>
      </>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateOrderModal);

export default withRouter(Container);
