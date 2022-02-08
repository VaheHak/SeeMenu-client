import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  getBranches,
  getRestaurantList,
} from '../store/actions/restaurant';
import Wrapper from '../components/Wrapper';
import RestaurantCard from '../components/RestaurantCard';
import EmptyBlock from '../components/EmptyBlock';

class Tables extends Component {
  static propTypes = {
    getRestaurantList: PropTypes.func.isRequired,
    restaurants: PropTypes.array.isRequired,
    getBranches: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    branches: PropTypes.array.isRequired,
    role: PropTypes.string.isRequired,
  };

  componentDidMount = async () => {
    await this.props.getRestaurantList();
  };

  handlePush = async (resId) => {
    const { role } = this.props;
    if (role === 'manager') {
      this.props.history.push(`/user/restaurant/tables/${resId}/${resId}`);
    } else {
      await this.props.getBranches(resId);

      if (this.props.branches.length > 1) {
        this.props.history.push(`/user/restaurant/tables/${resId}`);
      } else {
        const [branch] = this.props.branches;
        this.props.history.push(`/user/restaurant/tables/${branch.branchId}/${branch.id}`);
      }
    }
  };

  render() {
    const { restaurants } = this.props;
    return (
      <Wrapper>
        <div className="restaurantBlock">
          <div className="restaurants">
            <div className="restaurantList">
              {!_.isEmpty(restaurants)
                ? _.map(restaurants, (res) => (
                  <RestaurantCard
                    branch={false}
                    edit={false}
                    push={this.handlePush}
                    key={res.id}
                    res={res}
                  />
                )) : <EmptyBlock text="Not restaurants!" />}
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
});

const mapDispatchToProps = {
  getRestaurantList,
  getBranches,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tables);

export default Container;
