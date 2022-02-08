import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import RestaurantCard from '../components/RestaurantCard';
import { getRestaurantList, getBranches } from '../store/actions/restaurant';
import { getAllRestaurants, getAllBranches } from '../store/actions/restaurantsList';
import Wrapper from '../components/Wrapper';
import EmptyBlock from '../components/EmptyBlock';

class Menu extends Component {
  static propTypes = {
    getRestaurantList: PropTypes.func.isRequired,
    getBranches: PropTypes.func.isRequired,
    restaurants: PropTypes.array.isRequired,
    branches: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    role: PropTypes.string.isRequired,
    getAllRestaurants: PropTypes.func.isRequired,
    result: PropTypes.array.isRequired,
    getAllBranches: PropTypes.func.isRequired,
    adminBranches: PropTypes.array.isRequired,
  };

  componentDidMount = async () => {
    const { role } = this.props;

    if (role === 'superadmin') {
      await this.props.getAllRestaurants('');
    } else {
      await this.props.getRestaurantList();
    }
  };

  handlePush = async (resId) => {
    const { role } = this.props;

    if (role === 'superadmin') {
      await this.props.getAllBranches(resId, '');

      if (this.props.adminBranches.length > 1) {
        this.props.history.push(`/user/restaurants/${resId}`);
      } else {
        this.props.history.push(`/user/restaurant/menu/${resId}/${resId}`);
      }
    }

    if (role === 'manager') {
      this.props.history.push(`/user/restaurant/menu/${resId}/${resId}`);
    }
    if (role === 'admin') {
      await this.props.getBranches(resId);

      if (this.props.branches.length > 1) {
        this.props.history.push(`/user/restaurant/menu/${resId}`);
      } else {
        const [branch] = this.props.branches;

        this.props.history.push(`/user/restaurant/menu/${branch.branchId}/${branch.id}`);
      }
    }
  };

  render() {
    const {
      restaurants,
      result,
      role,
    } = this.props;

    return (
      <Wrapper>
        <div className="restaurantBlock">
          <div className="restaurants">
            <div className="restaurantList">
              {!_.isEmpty(result) || !_.isEmpty(restaurants)
                ? _.map(role === 'superadmin' ? result : restaurants, (res) => (
                  <RestaurantCard
                    branch={false}
                    edit={false}
                    push={this.handlePush}
                    key={res.id}
                    res={res}
                  />
                ))
                : <EmptyBlock text="Not restaurants!" />}
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  restaurants: state.restaurant.restaurants || [],
  branches: state.restaurant.branches || [],
  role: state.login.role,
  result: state.restaurantsList.result,
  adminBranches: state.restaurantsList.adminBranches,
});

const mapDispatchToProps = {
  getRestaurantList,
  getBranches,
  getAllRestaurants,
  getAllBranches,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Menu);

export default withRouter(Container);
