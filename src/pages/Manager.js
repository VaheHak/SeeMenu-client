import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import memoizeOne from 'memoize-one';
import moment from 'moment';
import {
  getManagers,
  deleteStatus,
  deleteManager,
  getSingleManager,
  closeManagerModal,
} from '../store/actions/manager';
import {
  getRestaurantList,
} from '../store/actions/restaurant';
import CreateManagerModal from '../components/Modals/CreateManagerModal';
import Wrapper from '../components/Wrapper';
import EmptyBlock from '../components/EmptyBlock';
import ManagerTr from '../components/Tables/ManagerTr';

import 'react-datepicker/dist/react-datepicker.css';
import DataPicker from '../components/Inputs/DataPicker';

class Manager extends Component {
  static propTypes = {
    getManagers: PropTypes.func.isRequired,
    getRestaurantList: PropTypes.func.isRequired,
    deleteStatus: PropTypes.func.isRequired,
    deleteManager: PropTypes.func.isRequired,
    getSingleManager: PropTypes.func.isRequired,
    editStatus: PropTypes.string.isRequired,
    createStatus: PropTypes.string.isRequired,
    deleteCreateStatus: PropTypes.string.isRequired,
    managers: PropTypes.array.isRequired,
    closeManagerModal: PropTypes.func.isRequired,
  };

  emptyTest = memoizeOne((managers) => {
    if (!_.isEmpty(managers)) {
      this.setState({
        empty: false,
      });
    }
  }, _.isEqual);

  constructor(props) {
    super(props);
    this.state = {
      createManager: false,
      updateManager: false,
      empty: true,
      date: new Date(),
      searchData: {},
      searchTime: null,
    };
  }

  componentDidMount = async () => {
    await this.props.getManagers();
  };

  openManagerCreateModal = async () => {
    await this.props.getRestaurantList();

    this.setState({
      createManager: true,
    });
  };

  closeManagerCreateModal = async () => {
    await this.props.getManagers();
    this.props.closeManagerModal();

    this.setState({
      createManager: false,
    });
  };

  deleteManager = async (id) => {
    await this.props.deleteManager(+id);
    await this.props.getManagers();
    this.props.closeManagerModal();
  };

  openEditManager = async (id) => {
    await this.props.getSingleManager(id);

    this.setState({
      updateManager: true,
    });
  };

  closeManagerEditModal = async () => {
    await this.props.getManagers();
    this.props.closeManagerModal();

    this.setState({
      updateManager: false,
    });
  };

  dateChange = (ev) => {
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

    this.setState({
      searchData,
      date,
      searchTime: setTimeout(() => {
        this.props.getManagers(searchData);
      }, 50),
    });
  };

  clearData = () => {
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

    this.setState({
      searchData,
      date,
      searchTime: setTimeout(() => {
        this.props.getManagers(searchData);
      }, 50),
    });
  }

  searchChange = (path, value) => {
    const {
      searchTime,
      searchData,
    } = this.state;

    _.set(searchData, path, value);

    if (searchTime) {
      clearTimeout(searchTime);
    }

    this.setState({
      searchData,
      searchTime: setTimeout(() => {
        this.props.getManagers(searchData);
      }, 2000),
    });
  };

  render() {
    const {
      createManager,
      updateManager,
      empty,
      date,
      searchData,
    } = this.state;

    const {
      createStatus,
      deleteCreateStatus,
      editStatus,
      managers,
    } = this.props;

    this.emptyTest(managers);

    return (
      <Wrapper>
        <div className="managers">
          <div className="controlBlock">
            <button type="button" onClick={this.openManagerCreateModal}>Add manager</button>
          </div>
          <div className="managersBlock">
            {empty
              ? (
                <EmptyBlock text="Not managers!" />
              )
              : (
                <table className="table">
                  <thead className="tableHead">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Surname</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Restaurant</th>
                      <th>Address</th>
                      <th>Create</th>
                      <th />
                    </tr>
                    <tr>
                      <th />
                      <th className="tableInput">
                        <input
                          type="text"
                          name="firstName"
                          onChange={(ev) => this.searchChange('firstName', ev.target.value)}
                          value={searchData?.firstName}
                        />
                      </th>
                      <th className="tableInput">
                        <input
                          type="text"
                          name="lastName"
                          onChange={(ev) => this.searchChange('lastName', ev.target.value)}
                          value={searchData?.lastName}
                        />
                      </th>
                      <th className="tableInput">
                        <input
                          type="email"
                          name="email"
                          onChange={(ev) => this.searchChange('email', ev.target.value)}
                          value={searchData?.email}
                        />
                      </th>
                      <th className="tableInput">
                        <input
                          type="tel"
                          name="phone"
                          onChange={(ev) => this.searchChange('phone', ev.target.value)}
                          value={searchData?.phone}
                        />
                      </th>
                      <th className="tableInput">
                        <input
                          type="text"
                          name="restaurantName"
                          onChange={(ev) => this.searchChange('restaurantName', ev.target.value)}
                          value={searchData?.restaurantName}
                        />
                      </th>
                      <th className="tableInput">
                        <input
                          type="text"
                          name="address"
                          onChange={(ev) => this.searchChange('address', ev.target.value)}
                          value={searchData?.address}
                        />
                      </th>
                      <th className="tableInput">
                        <DataPicker
                          change={this.dateChange}
                          date={date}
                          clear={this.clearData}
                        />
                      </th>
                      <th />
                    </tr>
                  </thead>
                  <tbody className="tableBody">
                    {_.map(managers, (m, index) => (
                      <ManagerTr
                        key={index}
                        index={index}
                        manager={m}
                        edit={this.openEditManager}
                        deleted={this.deleteManager}
                      />
                    ))}
                  </tbody>
                </table>
              )}
          </div>
        </div>
        {createManager
          ? (
            <CreateManagerModal
              rest
              em
              process="Create Manager"
              close={this.closeManagerCreateModal}
            />
          )
          : null}
        {updateManager
          ? (
            <CreateManagerModal
              rest={false}
              em={false}
              process="Edit Manager"
              close={this.closeManagerEditModal}
            />
          )
          : null}
        {createStatus
          ? (
            <Snackbar
              className="errorBar"
              open={!_.isEmpty(createStatus)}
              autoHideDuration={2000}
              onClose={this.props.deleteStatus}
            >
              <Alert onClose={this.props.deleteStatus} severity="success">
                Manager has been created!
              </Alert>
            </Snackbar>
          )
          : null}
        {deleteCreateStatus
          ? (
            <Snackbar
              className="errorBar"
              open={!_.isEmpty(deleteCreateStatus)}
              autoHideDuration={2000}
              onClose={this.props.deleteStatus}
            >
              <Alert onClose={this.props.deleteStatus} severity="error">
                Manager has been deleted!
              </Alert>
            </Snackbar>
          )
          : null}
        {editStatus
          ? (
            <Snackbar
              className="errorBar"
              open={!_.isEmpty(editStatus)}
              autoHideDuration={2000}
              onClose={this.props.deleteStatus}
            >
              <Alert onClose={this.props.deleteStatus} severity="success">
                {editStatus}
              </Alert>
            </Snackbar>
          )
          : null}
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  managers: state.manager.managers || [],
  createStatus: state.manager.create_status,
  deleteCreateStatus: state.manager.delete_status,
  editStatus: state.manager.edit_status,
});

const mapDispatchToProps = {
  getManagers,
  getRestaurantList,
  deleteStatus,
  deleteManager,
  getSingleManager,
  closeManagerModal,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Manager);

export default withRouter(Container);
