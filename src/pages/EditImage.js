import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import memoizeOne from 'memoize-one';
import {
  Button, Snackbar,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { getSingleRestaurant } from '../store/actions/restaurant';
import 'react-input-range/lib/css/index.css';
import {
  deleteOrdersForm,
  deleteOrderStatus,
  ordering,
  updateOrder,
} from '../store/actions/qr';

import EditPage from './EditPage';
import { deleteStyles } from '../store/actions/orders';

class EditImage extends Component {
  static propTypes = {
    restaurantData: PropTypes.object.isRequired,
    tables: PropTypes.object.isRequired,
    order: PropTypes.object.isRequired,
    orderQr: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    imageNumber: PropTypes.number.isRequired,
    ordering: PropTypes.func.isRequired,
    updateOrder: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    createOrderStatus: PropTypes.any.isRequired,
    deleteOrderStatus: PropTypes.func.isRequired,
    deleteStyles: PropTypes.func.isRequired,
    deleteOrdersForm: PropTypes.func.isRequired,
    viewOrder: PropTypes.bool.isRequired,
    orderHistoryOpen: PropTypes.bool.isRequired,
  };

  initStyles = memoizeOne((styles) => {
    if (_.isEmpty(styles)) {
      return;
    }
    _.map(styles, (s, name) => (
      this.setState({
        [name]: s,
      })
    ));
  }, _.isEqual);

  constructor(props) {
    super(props);
    this.state = {
      background: {
        backgroundColor: 'linear-gradient(#F08367, #F2BC57)',
      },
      restaurantName: {
        fontSize: 36,
      },
      tableName: {},
      titleStyle: {},
      subTitleStyle: {},
    };
  }

  orderTemplates = async () => {
    const {
      order,
      imageNumber,
      styles,
    } = this.props;
    await this.props.ordering(order, imageNumber, +this.props.match.params.id, styles);
    await this.props.deleteOrdersForm();
    this.props.deleteStyles();
    this.props.history.push(`/user/restaurant/tables/${+this.props.match.params.id}/${+this.props.match.params.id}`);
  };

  saveTemplates = async () => {
    const {
      styles,
      orderQr,
    } = this.props;
    await this.props.updateOrder(orderQr.id, styles, orderQr.status);
  };

  render() {
    const {
      order,
      restaurantData,
      tables,
      imageNumber,
      styles,
      orderQr,
      close,
      createOrderStatus,
      viewOrder,
      orderHistoryOpen,
    } = this.props;

    const {
      tableName, restaurantName, titleStyle, subTitleStyle, background,
    } = this.state;

    const roleState = !_.isEmpty(orderQr);
    if (!_.isEmpty(orderQr)) {
      this.initStyles(orderQr.styles);
    } else {
      this.initStyles(styles);
    }

    return (
      <div>
        {!_.isEmpty(restaurantData) || !_.isEmpty(order) || roleState ? (
          <>
            {
              !roleState ? (
                <>
                  <EditPage
                    restaurantName={restaurantName}
                    tableNameStyle={tableName}
                    titleStyle={titleStyle}
                    subTitleStyle={subTitleStyle}
                    background={background}
                    restaurantData={restaurantData}
                    order={order}
                    tables={tables}
                    tableName={Object.keys(Object.values(order)[0])[0]}
                    qrValue={Object.values(Object.values(order)[0])[1]}
                    templateNum={imageNumber}
                    viewOrder={viewOrder}
                  />
                  {!viewOrder ? (
                    <div>
                      <Button
                        color="default"
                        variant="contained"
                        size="small"
                        className="btn_order"
                        onClick={this.orderTemplates}
                      >
                        Order
                      </Button>
                    </div>
                  ) : null}
                  {createOrderStatus
                    ? (
                      <Snackbar
                        className="errorBar"
                        open={!_.isEmpty(createOrderStatus)}
                        autoHideDuration={2000}
                        onClose={this.props.deleteOrderStatus}
                      >
                        <Alert onClose={this.props.deleteOrderStatus} severity="success">
                          {createOrderStatus}
                        </Alert>
                      </Snackbar>
                    ) : null}
                </>
              ) : (
                <>
                  <EditPage
                    restaurantName={restaurantName}
                    tableNameStyle={tableName}
                    titleStyle={titleStyle}
                    subTitleStyle={subTitleStyle}
                    background={background}
                    restaurantData={!orderHistoryOpen ? orderQr.qrOrderRest : restaurantData}
                    order={order}
                    tables={tables}
                    tableName={Object.keys(Object.values(orderQr.tables)[0])[0]}
                    qrValue={Object.values(Object.values(orderQr.tables)[0])[1]}
                    templateNum={orderQr.template}
                    viewOrder={viewOrder}
                  />
                  { orderHistoryOpen ? null : (
                    <div>
                      <Button
                        color="default"
                        variant="contained"
                        size="small"
                        className="btn_save"
                        onMouseDown={this.saveTemplates}
                        onClick={close}
                      >
                        Save
                      </Button>
                    </div>
                  )}
                </>
              )
            }
          </>
        ) : <p>loading</p>}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  styles: state.orders.styles || {},
  createOrderStatus: state.qr.create_status,
  deleteOrderStatusString: state.qr.delete_status,
});

const mapDispatchToProps = {
  getSingleRestaurant,
  ordering,
  deleteOrderStatus,
  deleteOrdersForm,
  updateOrder,
  deleteStyles,
};
const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditImage);

export default withRouter(Container);
