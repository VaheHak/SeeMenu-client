import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Delete, Visibility } from '@material-ui/icons';
import _ from 'lodash';
import moment from 'moment';
import memoizeOne from 'memoize-one';
import CreateOrderModal from '../Modals/CreateOrderModal';
import {
  deleteOrder, getOrders, singleOrder,
} from '../../store/actions/qr';
import { getOrdersAll } from '../../store/actions/orders';
import DeleteCategoryModal from '../Modals/DeleteCategoryModal';

class OrderHistoryTr extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    order: PropTypes.object.isRequired,
    searchData: PropTypes.object.isRequired,
    singleOrder: PropTypes.func.isRequired,
    getOrdersAll: PropTypes.func.isRequired,
    getOrders: PropTypes.func.isRequired,
    deleteOrder: PropTypes.func.isRequired,
    deleteOrdersForm: PropTypes.func.isRequired,
  };

  initOrder = memoizeOne((order) => {
    if (_.isEmpty(order)) {
      return;
    }
    this.setState({
      status: {
        value: order.status,
        label: order.status,
      },
    });
  }, _.isEqual);

  constructor(props) {
    super(props);
    this.state = {
      openOrder: false,
      status: { value: 'pending', label: 'pending' },
    };
    this.status = [
      { value: 'pending', label: 'pending' },
      { value: 'inProcess', label: 'inProcess' },
      { value: 'finished', label: 'finished' },
    ];
  }

  openOrderTableModal = async (id) => {
    await this.props.singleOrder(id);
    this.setState({
      openOrder: true,
    });
  };

  closeOrderModal = async () => {
    const { searchData } = this.props;
    this.props.getOrdersAll(searchData);
    this.setState({
      openOrder: false,
    });
  };

  openDeleteOrderModal = () => {
    this.setState({
      orderDelete: true,
    });
  };

  closeDeleteOrderModal = async () => {
    await this.props.getOrders(this.props.order.restaurantQrId);

    this.setState({
      orderDelete: false,
    });
  };

  removeOrder = async () => {
    await this.props.deleteOrder(this.props.order.id);
    await this.props.getOrders(this.props.order.restaurantQrId);

    this.setState({
      orderDelete: false,
    });
  };

  openViewOrderModal = async () => {
    await this.props.singleOrder(this.props.order);
  };

  closeViewOrderModal = async () => {
    await this.props.deleteOrdersForm();
  };

  render() {
    const {
      order, index,
    } = this.props;

    const {
      openOrder, orderDelete, status,
    } = this.state;

    this.initOrder(order);

    return (
      <>
        {
          order ? (
            <tr
              className={status.value === 'pending' ? 'pending' : status.value === 'inProcess' ? 'inProcess' : 'completed'}
            >
              <td>{index + 1}</td>
              <td>
                <span>
                  {_.truncate(moment(order?.createdAt)
                    .format('DD MMMM YYYY '), {
                    length: 25,
                    separator: '...',
                  })}
                </span>
              </td>
              <td>
                {Object.keys(order.tables).length}
              </td>
              <td className="tableStatus">
                <div>
                  <div
                    className={status.value === 'pending' ? 'pending' : status.value === 'inProcess' ? 'inProcess' : 'completed'}
                  />
                  <span>
                    {order.status}
                  </span>
                </div>
              </td>
              <td>
                <div className="controlBlock">
                  <Visibility className="view" onClick={() => this.openOrderTableModal(order.id)} />
                </div>
              </td>
              <td>
                <div className="controlBlock">
                  <Delete onClick={this.openDeleteOrderModal} className="delete" />
                </div>
              </td>
              {orderDelete
                ? (
                  <DeleteCategoryModal
                    close={this.closeDeleteOrderModal}
                    deleteCategory={this.removeOrder}
                    text="Are you sure you want to delete this order?"
                  />
                ) : null}
              {(openOrder)
                ? (
                  <CreateOrderModal
                    close={this.closeOrderModal}
                    order={order}
                    viewOrder
                    orderHistoryOpen
                  />
                )
                : null}
            </tr>
          ) : null
        }
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  singleOrderOne: state.qr.single_order,
});

const mapDispatchToProps = {
  singleOrder,
  getOrdersAll,
  getOrders,
  deleteOrder,
};
const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderHistoryTr);

export default Container;
