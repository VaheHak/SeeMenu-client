import React, { Component } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { Close } from '@material-ui/icons';
import RestaurantCreate from '../Create/RestaurantCreate';

class CreateRestaurantModal extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    process: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired,
    restaurantId: PropTypes.any,
  };

  static defaultProps = {
    restaurantId: '',
  };

  render() {
    const {
      close, process, button, restaurantId,
    } = this.props;

    return (
      <Modal
        isOpen
        onRequestClose={() => close(restaurantId)}
        overlayClassName="restaurantRegisterModal"
      >
        <div className="closeBlock">
          <div className="process">
            <h3 className="signUp">{process}</h3>
          </div>
          <div className="closeButtonBlock" onClick={() => close(restaurantId)}>
            <Close />
          </div>
        </div>
        <RestaurantCreate
          restaurantName="Restaurant Name"
          restaurantAddress="Restaurant address"
          restaurantPhone="Phone"
          restaurantLink="Restaurant Link(URL)"
          restaurantSub="Restaurant Sub title"
          restaurantTime="Restaurant timing"
          restaurantLogo="Restaurant logo"
          restaurantCover="Restaurant cover"
          button={button}
          close={close}
          restaurantId={restaurantId}
        />
      </Modal>
    );
  }
}

export default CreateRestaurantModal;
