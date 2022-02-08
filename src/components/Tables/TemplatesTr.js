import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CloudDownload, Visibility } from '@material-ui/icons';
import _ from 'lodash';
import moment from 'moment';
import Select from 'react-select';
import memoizeOne from 'memoize-one';
import CreateTemplateModal from '../Modals/CreateTemplateModal';
import CreateOrderModal from '../Modals/CreateOrderModal';
import { singleOrder, updateOrder } from '../../store/actions/qr';
import { getOrdersAll } from '../../store/actions/orders';

class TemplatesTr extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    order: PropTypes.object.isRequired,
    singleOrderOne: PropTypes.object.isRequired,
    searchData: PropTypes.object.isRequired,
    singleOrder: PropTypes.func.isRequired,
    getOrdersAll: PropTypes.func.isRequired,
    updateOrder: PropTypes.func.isRequired,
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
      TemplateModal: false,
      status: { value: 'pending', label: `${<div className="ring" />} pending` },
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

  closeTemplateModal = async () => {
    const { searchData } = this.props;
    this.props.getOrdersAll(searchData);

    this.setState({
      TemplateModal: false,
    });
  };

  startGenerateModal = async (id) => {
    await this.props.singleOrder(id);
    this.setState({
      TemplateModal: true,
    });
  };

  changeStatus = async (selectedOption) => {
    console.log(selectedOption);
    const { order } = this.props;
    this.setState({ status: selectedOption });
    await this.props.updateOrder(order.id, order.styles, selectedOption.value);
  };

  render() {
    const {
      order, index, singleOrderOne,
    } = this.props;

    const { status, TemplateModal, openOrder } = this.state;

    this.initOrder(order);

    return (
      <tr
        className={status.value === 'pending' ? 'pending' : status.value === 'inProcess' ? 'inProcess' : 'completed'}
      >
        <td>
          <div>
            {index + 1}
          </div>
        </td>
        <td>
          <div>
            {order.qrOrderRest.name}
          </div>
        </td>
        <td>
          <div>
            {order.qrOrderRest.address}
          </div>
        </td>
        <td>
          <div>
            {order.qrOrderRest.phone}
          </div>
        </td>
        <td>
          <div>
            {_.truncate(moment(order?.createdAt)
              .format('DD MMMM YYYY  hh:mm:ss'), {
              length: 25,
              separator: '...',
            })}
          </div>
        </td>
        <td>
          <div>
            {Object.keys(order.tables).length}
          </div>
        </td>
        <td>
          <div>
            <Visibility
              className="order"
              onClick={() => this.openOrderTableModal(order.id)}
            />
          </div>
        </td>
        <td>
          <div>
            <CloudDownload
              className="buttonDownload"
              onClick={() => this.startGenerateModal(order.id)}
            />
          </div>
        </td>
        <td className="tableStatus">
          <Select
            className="statusSelectBlock"
            classNamePrefix="status"
            value={status}
            onChange={this.changeStatus}
            options={this.status}
          />
        </td>
        {TemplateModal ? (
          <CreateTemplateModal
            close={this.closeTemplateModal}
            order={singleOrderOne}
          />
        )
          : null}
        {(openOrder)
          ? (
            <CreateOrderModal
              close={this.closeOrderModal}
              order={singleOrderOne}
            />
          )
          : null}
      </tr>
    );
  }
}

const mapStateToProps = (state) => ({
  singleOrderOne: state.qr.single_order,
});

const mapDispatchToProps = {
  singleOrder,
  getOrdersAll,
  updateOrder,
};
const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TemplatesTr);

export default Container;
