import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import RestaurantCard from './RestaurantCard';
import {
  closeRestaurantChange,
  getBranches,
  getSingleRestaurant,
  deleteStatus,
} from '../store/actions/restaurant';
import CreateRestaurantModal from './Modals/CreateRestaurantModal';
import Wrapper from './Wrapper';
import { getAllBranches } from '../store/actions/restaurantsList';

class Branches extends Component {
  static propTypes = {
    closeRestaurantChange: PropTypes.func.isRequired,
    getBranches: PropTypes.func.isRequired,
    getSingleRestaurant: PropTypes.func.isRequired,
    deleteStatus: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    updateStatus: PropTypes.string.isRequired,
    createStatus: PropTypes.string.isRequired,
    branches: PropTypes.array,
    deleteCreateStatus: PropTypes.string.isRequired,
    adminBranches: PropTypes.array.isRequired,
    role: PropTypes.string.isRequired,
    getAllBranches: PropTypes.func.isRequired,
  };

  static defaultProps = {
    branches: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      restaurantId: false,
    };
  }

  componentDidMount = async () => {
    const { role } = this.props;
    if (role === 'superadmin') {
      await this.props.getAllBranches(this.props.match.params.resId, '');
    } else {
      await this.props.getBranches(this.props.match.params.id || this.props.match.params.resId);
    }
  };

  handlePush = (id, branchId) => {
    if (window.location.pathname.startsWith('/user/restaurant/tables/')) {
      this.props.history.push(`/user/restaurant/tables/${branchId}/${id}`);
    } else {
      this.props.history.push(`/user/restaurant/menu/${branchId}/${id}`) || [];
    }
  };

  openModal = async () => {
    await this.props.getSingleRestaurant(this.props.match.params.resId, 'en');
    this.setState({ restaurantId: this.props.match.params.resId });
  };

  closeModal = async () => {
    await this.props.getBranches(this.props.match.params.resId);
    await this.props.closeRestaurantChange();
    this.setState({ restaurantId: false });
  };

  render() {
    const {
      branches,
      createStatus,
      updateStatus,
      deleteCreateStatus,
      adminBranches,
    } = this.props;

    const { restaurantId } = this.state;

    return (
      <Wrapper>
        <div className="restaurantBlock">
          <div className="restaurants">
            <div className="buttons">
              <div className="addRestaurantBlock branches">
                <button type="button" onClick={() => this.props.history.goBack()}>
                  Back
                </button>
                {window.location.pathname.startsWith('/user/restaurants/')
                  ? (
                    <button type="button" onClick={this.openModal}>Add branch</button>
                  ) : null}
              </div>
            </div>
            <div className="restaurantList">
              {_.map(_.isEmpty(branches) ? adminBranches : branches, (res) => (
                <RestaurantCard
                  edit={window.location.pathname.startsWith('/user/restaurants/')}
                  branch={false}
                  push={this.handlePush}
                  createBranch={this.state.createBranch}
                  key={res.id}
                  res={res}
                />
              ))}
            </div>
          </div>
        </div>
        {!_.isEmpty(restaurantId)
          ? (
            <CreateRestaurantModal
              button="Create"
              restaurantId={restaurantId}
              close={this.closeModal}
              process="Branch Create"
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
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  branches: state.restaurant.branches,
  createStatus: state.restaurant.create_status,
  updateStatus: state.restaurant.update_status,
  deleteCreateStatus: state.restaurant.delete_status,
  adminBranches: state.restaurantsList.adminBranches,
  role: state.login.role,
});

const mapDispatchToProps = {
  closeRestaurantChange,
  getBranches,
  getSingleRestaurant,
  deleteStatus,
  getAllBranches,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Branches);

export default withRouter(Container);
