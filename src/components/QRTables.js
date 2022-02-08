import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ArrowBackIos } from '@material-ui/icons';
import _ from 'lodash';
import { CircularProgress, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import memoizeOne from 'memoize-one';
import Select from 'react-select';
import moment from 'moment';
import Wrapper from './Wrapper';
import CreateTableModal from './Modals/CreateTableModal';
import { getSingleRestaurant } from '../store/actions/restaurant';
import {
  closeTableChange,
  deleteTable,
  deleteStatus,
  getSingleTable,
  getTables,
} from '../store/actions/table';
import {
  deleteOrdersForm,
  getOrders,
  deleteOrderStatus,
  deleteOrder,
} from '../store/actions/qr';
import DeleteCategoryModal from './Modals/DeleteCategoryModal';
import OrderQr from '../pages/OrderQr';
import EmptyBlock from './EmptyBlock';
import TableRect from './TableRect';
import OrderHistoryTr from './Tables/OrderHistoryTr';
import DataPicker from './Inputs/DataPicker';

class QrTables extends Component {
  static propTypes = {
    getOrders: PropTypes.func.isRequired,
    getSingleRestaurant: PropTypes.func.isRequired,
    closeTableChange: PropTypes.func.isRequired,
    getTables: PropTypes.func.isRequired,
    deleteTable: PropTypes.func.isRequired,
    getSingleTable: PropTypes.func.isRequired,
    deleteStatus: PropTypes.func.isRequired,
    deleteOrderStatus: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    singleTable: PropTypes.object.isRequired,
    deleteCreateStatus: PropTypes.string.isRequired,
    createStatus: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    createOrderStatus: PropTypes.string.isRequired,
    deleteOrderStatusString: PropTypes.string.isRequired,
    orderHistory: PropTypes.array.isRequired,
    updateStatus: PropTypes.string.isRequired,
    tables: PropTypes.any.isRequired,
    restaurantData: PropTypes.object.isRequired,
  };

  emptyTableTest = memoizeOne((tables) => {
    if (!_.isEmpty(tables)) {
      this.setState({
        emptyTables: false,
      });
    }
  }, _.isEqual);

  emptyOrderTest = memoizeOne((orders) => {
    if (!_.isEmpty(orders)) {
      this.setState({
        emptyOrders: false,
      });
    }
  }, _.isEqual);

  constructor(props) {
    super(props);
    this.state = {
      createTable: false,
      updateTable: false,
      deleteTableBool: false,
      openOrder: false,
      tableLoad: true,
      emptyTables: true,
      emptyOrders: true,
      create: false,
      searchData: {},
      status: { value: '', label: 'all' },
      date: new Date(),
    };
    this.status = [
      { value: '', label: 'all' },
      { value: 'pending', label: 'pending' },
      { value: 'inProcess', label: 'inProcess' },
      { value: 'finished', label: 'finished' },
    ];
  }

  componentDidMount = async () => {
    await this.props.getSingleRestaurant(this.props.match.params.id, 'en');
    await this.props.getTables(this.props.match.params.id);
    await this.props.getOrders(this.props.match.params.id);
    this.setState({
      tableLoad: false,
    });
  };

  openCreateTableModal = () => {
    this.setState({ createTable: true });
    this.props.getSingleRestaurant(this.props.match.params.id, 'en');
  };

  closeCreateTableModal = async () => {
    await this.props.getTables(this.props.match.params.id);
    await this.props.closeTableChange();
    this.setState({ createTable: false });
  };

  openEditTableModal = async (tableId) => {
    await this.props.getSingleTable(tableId);

    this.setState({
      updateTable: true,
    });
  };

  closeEditTableModal = async () => {
    await this.props.closeTableChange();
    await this.props.getTables(this.props.match.params.id);

    this.setState({
      updateTable: false,
    });
  };

  openDeleteTableModal = async (tableId) => {
    await this.props.getSingleTable(tableId);

    this.setState({
      deleteTableBool: true,
    });
  };

  closeDeleteTableModal = async () => {
    await this.props.closeTableChange();
    await this.props.getTables(this.props.match.params.id);

    this.setState({
      deleteTableBool: false,
    });
  };

  openOrderTable = () => {
    const { id, resId } = this.props.match.params;
    const { tables } = this.props;
    if (!_.isEmpty(tables)) {
      this.props.history.push(`/user/restaurant/tables/${resId}/${id}/orderQr/`);
    }
  };

  removeTable = async () => {
    const { singleTable } = this.props;

    await this.props.deleteTable(singleTable.id);
    await this.props.closeTableChange();
    await this.props.getTables(this.props.match.params.id);

    this.setState({
      deleteTableBool: false,
    });
  };

  changeStatus = async (selectedOption) => {
    const { searchData } = this.state;

    _.set(searchData, 'status', selectedOption.value);

    await this.props.getOrders(this.props.match.params.id, searchData);

    this.setState({
      status: selectedOption,
      searchData,
    });
  };

  dateChange = async (ev) => {
    const {
      searchTime,
      searchData,
    } = this.state;

    const data = new Date(ev);

    const date = moment(data)
      .format('DD MMM YYYY');

    _.set(searchData, 'createdAt', data.toISOString());

    if (searchTime) {
      clearTimeout(searchTime);
    }

    await this.props.getOrders(this.props.match.params.id, searchData);

    this.setState({
      searchData,
      date,
    });
  };

  clearData = async () => {
    const {
      searchTime,
      searchData,
    } = this.state;

    const date = moment(new Date())
      .format('DD MMM YYYY');

    _.set(searchData, 'createdAt', '');

    if (searchTime) {
      clearTimeout(searchTime);
    }

    await this.props.getOrders(this.props.match.params.id, searchData);

    this.setState({
      searchData,
      date,
    });
  };

  render() {
    const {
      createTable,
      updateTable,
      deleteTableBool,
      openOrder,
      tableLoad,
      emptyTables,
      emptyOrders,
      create,
      status,
      date,
    } = this.state;

    const {
      tables,
      deleteCreateStatus,
      createStatus,
      updateStatus,
      orderHistory,
      createOrderStatus,
      deleteOrderStatusString,
      restaurantData,
    } = this.props;

    this.emptyTableTest(tables);

    this.emptyOrderTest(orderHistory);

    return (
      <Wrapper>
        <div className="tables">
          {tableLoad
            ? (
              <div className="loadingBLock">
                <div className="loading">
                  <CircularProgress className="load" size={50} />
                </div>
              </div>
            )
            : (
              <>
                <div className="tablesRoot">
                  <ArrowBackIos
                    className="backButton"
                    onClick={() => this.props.history.goBack()}
                  />
                  <div className="RestaurantNameRoot">
                    <div className="restaurantNameBlock">
                      <h1 className="restaurantName">
                        {restaurantData.name}
                      </h1>
                      <p className="restaurantAddress">
                        {restaurantData.address}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="container">
                  <div className="buttonsBlock">
                    <button type="button" onClick={this.openCreateTableModal}>Add table</button>
                    <button type="button" onClick={this.openOrderTable}>Order QR</button>
                  </div>
                  <p className="pageTitle">Tables</p>
                  <div className="tablesBlock">
                    {emptyTables
                      ? (
                        <EmptyBlock text="Not tables!" />
                      )
                      : (
                        <TableRect
                          edit={this.openEditTableModal}
                          tables={tables}
                          deleted={this.openDeleteTableModal}
                        />
                      )}
                  </div>
                  <div className="historyBlock">
                    <p className="orderHistoryName">Order history</p>
                    <div className="orderHistory">
                      {emptyOrders
                        ? (
                          <EmptyBlock text="Not orders!" />
                        )
                        : (
                          <>
                            <table className="table">
                              <thead className="tableHead">
                                <tr>
                                  <th />
                                  <th>Ordered at</th>
                                  <th>Tables QTY</th>
                                  <th>Status</th>
                                  <th />
                                  <th />
                                </tr>
                                <tr>
                                  <th />
                                  <th className="tableInput">
                                    <DataPicker
                                      change={this.dateChange}
                                      date={date}
                                      clear={this.clearData}
                                    />
                                  </th>
                                  <th />
                                  <th className="tableInput">
                                    <Select
                                      className="statusSelectBlock"
                                      classNamePrefix="status"
                                      value={status}
                                      onChange={this.changeStatus}
                                      options={this.status}
                                    />
                                  </th>
                                  <th />
                                  <th />
                                </tr>
                              </thead>
                              <tbody className="tableBody">
                                {_.map(orderHistory, (order, index) => (
                                  <OrderHistoryTr
                                    index={index}
                                    order={order}
                                  />
                                ))}
                              </tbody>
                            </table>
                          </>
                        )}
                    </div>
                    {_.isEmpty(orderHistory) ? (
                      <EmptyBlock text="No Such Orders" />
                    ) : null}
                  </div>
                </div>
              </>
            )}
        </div>
        {createTable
          ? (
            <CreateTableModal
              close={this.closeCreateTableModal}
              tableProcess="Add table"
              button="Save"
            />
          ) : null}
        {updateTable
          ? (
            <CreateTableModal
              close={this.closeEditTableModal}
              tableProcess="Edit table"
              button="Edit"
            />
          ) : null}
        {deleteTableBool
          ? (
            <DeleteCategoryModal
              close={this.closeDeleteTableModal}
              deleteCategory={this.removeTable}
              text="Are you sure you want to delete this table?"
            />
          ) : null}
        {deleteCreateStatus
          ? (
            <Snackbar
              className="errorBar"
              open={!_.isEmpty(deleteCreateStatus)}
              autoHideDuration={2000}
              onClose={this.props.deleteStatus}
            >
              <Alert onClose={this.props.deleteStatus} severity="error">
                {deleteCreateStatus}
              </Alert>
            </Snackbar>
          ) : null}
        {createStatus
          ? (
            <Snackbar
              className="errorBar"
              open={!_.isEmpty(createStatus)}
              autoHideDuration={2000}
              onClose={this.props.deleteStatus}
            >
              <Alert onClose={this.props.deleteStatus} severity="success">
                {createStatus}
              </Alert>
            </Snackbar>
          ) : null}
        {updateStatus
          ? (
            <Snackbar
              className="errorBar"
              open={!_.isEmpty(updateStatus)}
              autoHideDuration={2000}
              onClose={this.props.deleteStatus}
            >
              <Alert onClose={this.props.deleteStatus} severity="success">
                {updateStatus}
              </Alert>
            </Snackbar>
          ) : null}
        {openOrder
          ? (
            <OrderQr
              control
              create={create}
            />
          )
          : null}
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
        {deleteOrderStatusString
          ? (
            <Snackbar
              className="errorBar"
              open={!_.isEmpty(deleteOrderStatusString)}
              autoHideDuration={2000}
              onClose={this.props.deleteOrderStatus}
            >
              <Alert onClose={this.props.deleteOrderStatus} severity="error">
                {deleteOrderStatusString}
              </Alert>
            </Snackbar>
          ) : null}
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  tables: state.table.tables,
  singleTable: state.table.single_table,
  deleteCreateStatus: state.table.delete_status,
  createStatus: state.table.create_status,
  updateStatus: state.table.update_status,
  orderHistory: state.qr.order_history,
  createOrderStatus: state.qr.create_status,
  deleteOrderStatusString: state.qr.delete_status,
  restaurantData: state.restaurant.restaurantData,
});

const mapDispatchToProps = {
  getSingleRestaurant,
  closeTableChange,
  getSingleTable,
  getTables,
  deleteTable,
  deleteStatus,
  deleteOrdersForm,
  getOrders,
  deleteOrder,
  deleteOrderStatus,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(QrTables);

export default Container;
