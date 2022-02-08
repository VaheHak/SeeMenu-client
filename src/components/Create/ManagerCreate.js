import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Select from 'react-select';
import memoizeOne from 'memoize-one';
import _ from 'lodash';
import {
  getBranchesWithoutManager,
} from '../../store/actions/restaurant';
import {
  createManager,
  createManagerChange,
  updateManager,
} from '../../store/actions/manager';
import Input from '../Inputs/Input';

class ManagerCreate extends Component {
  static propTypes = {
    createManagerChange: PropTypes.func.isRequired,
    createManager: PropTypes.func.isRequired,
    getBranchesWithoutManager: PropTypes.func.isRequired,
    updateManager: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    em: PropTypes.bool.isRequired,
    managerData: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    singleManager: PropTypes.object.isRequired,
    rest: PropTypes.bool.isRequired,
    restaurants: PropTypes.array.isRequired,
  }

  initRestaurant = memoizeOne((restaurants) => {
    if (!_.isEmpty(restaurants)) {
      const { restaurantList } = this.state;
      _.map(restaurants, (item) => {
        restaurantList.push({
          value: item.id,
          label: item.name,
        });
      });
    }
  }, _.isEqual)

  initSingleRestaurant = memoizeOne((single) => {
    _.map(single, (value, path) => {
      this.managerChange(path, value);
    });
  }, _.isEqual)

  constructor(props) {
    super(props);
    this.state = {
      restaurantList: [],
      branchList: [],
      disabled: false,
      restaurant: {
        value: '',
        label: '',
      },
      branch: {
        value: '',
        label: '',
      },
    };
  }

  managerSave = async (ev) => {
    ev.preventDefault();

    const { managerData, em } = this.props;

    if (em) {
      await this.props.createManager(managerData);
      if (_.isEmpty(this.props.errors)) {
        this.props.close();
      }
    } else {
      await this.props.updateManager(managerData);
      if (_.isEmpty(this.props.errors)) {
        this.props.close();
      }
    }
  }

  managerChange = (path, value) => {
    this.props.createManagerChange(path, value);
  }

  selectRestaurant = async (restaurant) => {
    this.managerChange('restaurantId', restaurant.value);

    let { disabled } = this.state;
    const branchList = [];

    const {
      payload: {
        data: {
          result: branches,
        },
      },
    } = await this.props.getBranchesWithoutManager(restaurant.value);

    if (branches.length > 1) {
      disabled = true;
      _.map(branches, (item) => {
        branchList.push({
          value: item.id,
          label: item.address,
        });
      });
    }

    this.setState({
      restaurant,
      disabled,
      branchList,
    });
  }

  selectBranch = (branch) => {
    this.managerChange('restaurantId', branch.value);

    this.setState({
      branch,
    });
  }

  render() {
    const {
      errors,
      managerData,
      restaurants,
      singleManager,
      rest,
      em,
    } = this.props;

    const {
      restaurantList,
      branchList,
      restaurant,
      branch,
      disabled,
    } = this.state;

    if (!_.isEmpty(singleManager)) {
      this.initSingleRestaurant(singleManager);
    }

    this.initRestaurant(restaurants);

    return (
      <form onSubmit={this.managerSave} className="managerForm">
        {rest ? (
          <div className="restaurantSelect">
            <p className="restaurantSelectName">Choose restaurant</p>
            <Select
              className="restaurantSelectBlock"
              classNamePrefix="restaurant"
              value={restaurant}
              onChange={this.selectRestaurant}
              options={restaurantList}
            />
          </div>
        ) : null}
        {disabled
          ? (
            <div className="restaurantSelect">
              <p className="restaurantSelectName">Choose branch</p>
              <Select
                className="restaurantSelectBlock"
                classNamePrefix="restaurant"
                value={branch}
                onChange={this.selectBranch}
                options={branchList}
              />
            </div>
          )
          : null}
        <Input
          className="inputArea"
          label="Name"
          type="text"
          helperText={errors?.firstName}
          onChange={(ev) => this.managerChange('firstName', ev.target.value)}
          value={managerData.firstName}
        />
        <Input
          className="inputArea"
          label="Surname"
          type="text"
          helperText={errors?.lastName}
          onChange={(ev) => this.managerChange('lastName', ev.target.value)}
          value={managerData.lastName}
        />
        {em ? (
          <Input
            className="inputArea"
            label="Email"
            type="email"
            helperText={errors?.email}
            onChange={(ev) => this.managerChange('email', ev.target.value)}
            value={managerData.email}
          />
        ) : null}
        <button type="submit">{em ? 'Create' : 'Edit'}</button>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.manager.errors,
  managerData: state.manager.managerData,
  restaurants: state.restaurant.restaurants,
  singleManager: state.manager.single_manager,
});

const mapDispatchToProps = {
  createManagerChange,
  createManager,
  updateManager,
  getBranchesWithoutManager,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManagerCreate);

export default withRouter(Container);
