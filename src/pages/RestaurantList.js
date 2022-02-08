import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import memoizeOne from 'memoize-one';
import {
  getBranches,
  getRestaurantList,
  closeRestaurantChange,
  deleteStatus,
} from '../store/actions/restaurant';
import RestaurantCard from '../components/RestaurantCard';
import Wrapper from '../components/Wrapper';
import CreateRestaurantModal from '../components/Modals/CreateRestaurantModal';
import { getAllBranches, getAllRestaurants } from '../store/actions/restaurantsList';
import EmptyBlock from '../components/EmptyBlock';

class RestaurantList extends Component {
  static propTypes = {
    getRestaurantList: PropTypes.func.isRequired,
    closeRestaurantChange: PropTypes.func.isRequired,
    restaurants: PropTypes.array.isRequired,
    getBranches: PropTypes.func.isRequired,
    deleteStatus: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    branches: PropTypes.array.isRequired,
    createStatus: PropTypes.string.isRequired,
    updateStatus: PropTypes.string.isRequired,
    deleteCreateStatus: PropTypes.string.isRequired,
    result: PropTypes.array.isRequired,
    getAllRestaurants: PropTypes.func.isRequired,
    role: PropTypes.string.isRequired,
    adminBranches: PropTypes.array.isRequired,
    getAllBranches: PropTypes.func.isRequired,
  };

  emptyTest = memoizeOne((res, results) => {
    if (!_.isEmpty(res) || !_.isEmpty(results)) {
      this.setState({
        empty: false,
      });
    }
  }, _.isEqual);

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      search: '',
      empty: true,
    };
  }

  async componentDidMount() {
    const { search } = this.state;
    const { role } = this.props;
    if (role === 'superadmin') {
      await this.props.getAllRestaurants(search);
    } else {
      await this.props.getRestaurantList();
    }
  }

  openModal = () => this.setState({ modalIsOpen: true });

  closeModal = async () => {
    await this.props.closeRestaurantChange();
    await this.props.getRestaurantList();
    this.setState({
      modalIsOpen: false,
    });
  };

  handlePush = async (id) => {
    const { role } = this.props;

    if (role === 'superadmin') {
      await this.props.getAllBranches(id, '');

      if (this.props.adminBranches.length > 1) {
        this.props.history.push(`/user/restaurants/${id}`);
      } else {
        this.props.history.push(`/user/restaurant/menu/${id}/${id}`);
      }
    }

    if (role === 'manager') {
      this.props.history.push(`/user/restaurant/menu/${id}/${id}`);
    }

    if (role === 'admin') {
      await this.props.getBranches(id);
      if (this.props.branches.length > 1) {
        this.props.history.push(`/user/restaurants/${id}`);
      } else {
        const [branch] = this.props.branches;
        this.props.history.push(`/user/restaurant/menu/${branch.branchId}/${branch.id}`);
      }
    }
  };

  handleSearch = async (event) => {
    const search = event.target.value;
    await this.props.getAllRestaurants(search);
  };

  render() {
    const {
      modalIsOpen,
      empty,
    } = this.state;
    const {
      restaurants,
      createStatus,
      updateStatus,
      deleteCreateStatus,
      result,
      role,
    } = this.props;

    this.emptyTest(result, restaurants);

    return (
      <Wrapper>
        <div className="restaurantBlock">
          <div className="restaurants">
            <div className="buttons">
              <div className="searchBlog">
                {role === 'superadmin'
                  ? (
                    <input
                      type="search"
                      name="search"
                      placeholder="Search..."
                      onChange={this.handleSearch}
                    />
                  ) : null}
              </div>
              {role === 'manager' ? null
                : (
                  <div className="addRestaurantBlock">
                    <button type="button" onClick={this.openModal}>Add restaurant</button>
                  </div>
                )}
            </div>
            {empty
              ? (
                <EmptyBlock text="Not restaurants!" />
              )
              : (
                <div className="restaurantList">
                  {_.map(role === 'superadmin' ? result : restaurants, (res) => (
                    <RestaurantCard
                      edit
                      branch
                      push={this.handlePush}
                      key={res.id}
                      res={res}
                    />
                  ))}
                </div>
              )}
            {modalIsOpen
              ? (
                <CreateRestaurantModal
                  close={this.closeModal}
                  process="Register Restaurant"
                  button="Register"
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
          </div>
        </div>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  restaurants: state.restaurant.restaurants || [],
  branches: state.restaurant.branches || [],
  createStatus: state.restaurant.create_status,
  updateStatus: state.restaurant.update_status,
  deleteCreateStatus: state.restaurant.delete_status,
  result: state.restaurantsList.result || [],
  adminBranches: state.restaurantsList.adminBranches || [],
  role: state.login.role,
});

const mapDispatchToProps = {
  getRestaurantList,
  closeRestaurantChange,
  getBranches,
  deleteStatus,
  getAllRestaurants,
  getAllBranches,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RestaurantList);

export default Container;
