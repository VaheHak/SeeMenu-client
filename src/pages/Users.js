import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import memoizeOne from 'memoize-one';
import moment from 'moment';
import Select from 'react-select';
import Wrapper from '../components/Wrapper';
import {
  deleteUsersList,
  getUsersList,
  roleFilter,
  updateUsersList,
  updateUsersStatus,
  userChange,
} from '../store/actions/usersList';
import EmptyBlock from '../components/EmptyBlock';
import DataPicker from '../components/Inputs/DataPicker';
import UserTr from '../components/Tables/UserTr';
import { getAllRestaurants } from '../store/actions/restaurantsList';
import EditUsersModal from '../components/Modals/EditUsersModal';
import DeleteCategoryModal from '../components/Modals/DeleteCategoryModal';

class Users extends Component {
  static propTypes = {
    result: PropTypes.array.isRequired,
    errors: PropTypes.object.isRequired,
    formData: PropTypes.object.isRequired,
    updateUsersList: PropTypes.func.isRequired,
    roleFilter: PropTypes.func.isRequired,
    deleteUsersList: PropTypes.func.isRequired,
    getUsersList: PropTypes.func.isRequired,
    userChange: PropTypes.func.isRequired,
  };

  emptyTest = memoizeOne((result) => {
    if (!_.isEmpty(result)) {
      this.setState({
        empty: false,
      });
    }
  }, _.isEqual);

  constructor(props) {
    super(props);
    this.state = {
      empty: true,
      date: new Date(),
      role: {
        value: 'all',
        label: 'All',
      },
      editUsersModal: false,
      openDeleteModal: false,
      id: '',
      searchData: {},
      searchTime: null,
    };
    this.role = [
      {
        value: 'all',
        label: 'All',
      },
      {
        value: 'admin',
        label: 'Admin',
      },
      {
        value: 'manager',
        label: 'Manager',
      },
    ];
  }

  componentDidMount() {
    this.props.getUsersList();
  }

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
        this.props.getUsersList(searchData);
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
        this.props.getUsersList(searchData);
      }, 50),
    });
  }

  handleEdit = (user) => {
    _.map(user, (value, path) => {
      this.props.userChange(value, path);
    });

    this.setState({ editUsersModal: true });
  };

  selectRole = (role) => {
    this.props.roleFilter(role.value);

    this.setState({
      role,
    });
  };

  handleEditChange = (value, path) => {
    this.props.userChange(value, path);
  };

  updateUser = async () => {
    const { formData } = this.props;

    await this.props.updateUsersList(formData);

    await this.props.getUsersList();

    this.setState({
      editUsersModal: false,
    });
  };

  closeUsersModal = () => {
    this.setState({ editUsersModal: false });
  };

  handleDelete = async (id) => {
    this.setState({
      openDeleteModal: true,
      id,
    });
  };

  deleteUser = async () => {
    const { id } = this.state;

    await this.props.deleteUsersList(id);
    await this.props.getUsersList();

    this.setState({
      openDeleteModal: false,
      id: '',
    });
  };

  closeDeleteModal = () => {
    this.setState({
      id: '',
      openDeleteModal: false,
    });
  };

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
        this.props.getUsersList(searchData);
      }, 2000),
    });
  };

  render() {
    const {
      result,
      errors,
      formData,
    } = this.props;

    const {
      empty,
      date,
      role,
      editUsersModal,
      openDeleteModal,
      searchData,
    } = this.state;

    this.emptyTest(result);

    return (
      <Wrapper>
        <div className="users">
          <h3 className="usersBlock">Users</h3>
          <div className="users__Block">
            {empty
              ? (
                <EmptyBlock text="Not users!" />
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
                      <th>Role</th>
                      <th>Create</th>
                      <th>Status</th>
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
                        <Select
                          className="roleSelectBlock"
                          classNamePrefix="role"
                          value={role}
                          onChange={this.selectRole}
                          options={this.role}
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
                      <th />
                    </tr>
                  </thead>
                  <tbody className="tableBody">
                    {_.map(result, (u, index) => (
                      <UserTr
                        key={index}
                        index={index}
                        user={u}
                        edit={this.handleEdit}
                        deleted={this.handleDelete}
                      />
                    ))}
                  </tbody>
                </table>
              )}
          </div>
        </div>
        {editUsersModal ? (
          <EditUsersModal
            close={this.closeUsersModal}
            updateUser={this.updateUser}
            change={this.handleEditChange}
            errors={errors}
            formData={formData}
          />
        )
          : null}
        {openDeleteModal
          ? (
            <DeleteCategoryModal
              deleteCategory={this.deleteUser}
              close={this.closeDeleteModal}
              text="Are you sure that delete this User?"
            />
          )
          : null}
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  result: state.usersList.roleData || [],
  updateUsers: state.usersList.updateUsers || {},
  updateStatus: state.usersList.updateStatus || {},
  errors: state.usersList.errors || {},
  formData: state.usersList.formData || {},
});

const mapDispatchToProps = {
  updateUsersList,
  updateUsersStatus,
  deleteUsersList,
  getUsersList,
  userChange,
  getAllRestaurants,
  roleFilter,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Users);

export default Container;
