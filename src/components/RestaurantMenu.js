import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Button,
  CircularProgress,
  Snackbar,
  Tooltip,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import memoizeOne from 'memoize-one';
import {
  Edit,
  RemoveRedEye,
  Save,
} from '@material-ui/icons';
import Wrapper from './Wrapper';
import {
  getSingleRestaurant,
} from '../store/actions/restaurant';
import {
  getOneRestaurant,
} from '../store/actions/restaurantsList';
import {
  closeCategoryChange,
  getCategories,
  deleteStatus,
} from '../store/actions/category';

import {
  getSingleCategoryMenu,
  globalUpdateSave,
} from '../store/actions/menu';
import CategoryAccordion from './Accordions/CategoryAccordion';
import CreateCategoryModal from './Modals/CreateCategoryModal';
import EmptyBlock from './EmptyBlock';

class RestaurantMenu extends Component {
  static propTypes = {
    getCategories: PropTypes.func.isRequired,
    closeCategoryChange: PropTypes.func.isRequired,
    getSingleCategoryMenu: PropTypes.func.isRequired,
    getSingleRestaurant: PropTypes.func.isRequired,
    deleteStatus: PropTypes.func.isRequired,
    deleteCreateStatus: PropTypes.string.isRequired,
    createStatus: PropTypes.string.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    restaurant: PropTypes.object.isRequired,
    globalUpdateSave: PropTypes.func.isRequired,
    globalData: PropTypes.array.isRequired,
    role: PropTypes.string.isRequired,
    getOneRestaurant: PropTypes.func.isRequired,
    singleRestaurant: PropTypes.object.isRequired,
  };

  emptyTest = memoizeOne((managers) => {
    if (!_.isEmpty(managers)) {
      this.setState({
        empty: false,
      });
    } else {
      this.setState({
        empty: true,
      });
    }
  }, _.isEqual);

  constructor(props) {
    super(props);
    this.state = {
      categoryModal: false,
      categoryId: '',
      load: true,
      empty: true,
      disable: true,
    };
  }

  componentDidMount = async () => {
    const { role } = this.props;

    if (role === 'superadmin') {
      await this.props.getOneRestaurant(this.props.match.params.id, 'en');
      await this.props.getCategories(this.props.match.params.id, this.props.match.params.resId, 'en');
    } else {
      await this.props.getSingleRestaurant(this.props.match.params.id, 'en');
      await this.props.getCategories(this.props.match.params.id, this.props.match.params.resId, 'en');
    }
    this.setState({
      load: false,
    });
  };

  openCategoryCreateModal = async () => {
    await this.props.closeCategoryChange();

    this.setState({
      categoryModal: true,
    });
  };

  closeCategoryCreateModal = async () => {
    await this.props.getCategories(this.props.match.params.id, this.props.match.params.resId, 'en');
    await this.props.closeCategoryChange();

    this.setState({
      categoryModal: false,
    });
  };

  openCategory = async (catId, restaurantId, lang, name) => {
    await this.props.getSingleCategoryMenu(
      catId,
      this.props.match.params.id,
      this.props.match.params.resId,
      lang,
      1,
      name,
    );

    const { categoryId } = this.state;

    if (catId === categoryId) {
      this.setState({
        categoryId: '',
      });
    } else {
      this.setState({
        categoryId: catId,
      });
    }
  };

  globalEditClick = async () => {
    const {
      disable,
      categoryId,
    } = this.state;

    if (!disable) {
      await this.props.getCategories(this.props.match.params.id, this.props.match.params.resId, 'en');

      await this.props.getSingleCategoryMenu(categoryId, this.props.match.params.id, this.props.match.params.resId, 'en', 1, '', true);
    }

    this.setState({
      disable: !disable,
    });
  };

  globalSaveClick = async () => {
    const { categoryId } = this.state;

    this.props.globalUpdateSave(this.props.globalData);

    await this.props.getCategories(this.props.match.params.id, this.props.match.params.resId, 'en');

    await this.props.getSingleCategoryMenu(categoryId, this.props.match.params.id, this.props.match.params.resId, 'en', 1);

    this.setState({
      disable: true,
    });
  };

  render() {
    const {
      categoryModal,
      categoryId,
      load,
      empty,
      disable,
    } = this.state;

    const {
      categories,
      restaurant,
      createStatus,
      deleteCreateStatus,
      singleRestaurant,
    } = this.props;

    this.emptyTest(categories);

    return (
      <Wrapper>
        <div className="menusBlock">
          {load
            ? (
              <div className="loadingBLock">
                <div className="loading">
                  <CircularProgress className="load" size={50} />
                </div>
              </div>
            )
            : (
              <div className="root">
                <div className="RestaurantNameRoot">
                  <div className="restaurantNameBlock">
                    <h1 className="restaurantName">
                      {restaurant.name || singleRestaurant.name}
                    </h1>
                    <p className="restaurantAddress">
                      {restaurant.address || singleRestaurant.address}
                    </p>
                  </div>
                </div>
                <div className="menuSearchBlock">
                  <button
                    type="button"
                    className="categoryCreate"
                    onClick={() => this.props.history.goBack()}
                  >
                    Back
                  </button>
                  {/* <input type="text" placeholder="Search text" /> */}
                  <div className="editBlock">
                    {disable
                      ? (
                        <Tooltip title="Edit all prices" arrow onClick={this.globalEditClick}>
                          <Button>
                            <Edit />
                          </Button>
                        </Tooltip>
                      )
                      : (
                        <>
                          <Tooltip title="Save" arrow onClick={this.globalSaveClick}>
                            <Button>
                              <Save />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Look" arrow onClick={this.globalEditClick}>
                            <Button>
                              <RemoveRedEye />
                            </Button>
                          </Tooltip>
                        </>
                      )}
                    <button
                      type="button"
                      className="categoryCreate"
                      onClick={this.openCategoryCreateModal}
                    >
                      Add Category
                    </button>
                  </div>
                </div>
                {empty
                  ? (
                    <EmptyBlock text="Not categories!" />
                  )
                  : _.map(categories, (category) => (
                    <CategoryAccordion
                      key={category.id}
                      category={category}
                      categoryId={categoryId}
                      openCategory={this.openCategory}
                      disable={disable}
                    />
                  ))}
              </div>
            )}
        </div>
        {categoryModal
          ? (
            <CreateCategoryModal
              categoryProcess="Add category"
              close={this.closeCategoryCreateModal}
            />
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
  categories: state.category.categories || [],
  menus: state.category.menus || {},
  restaurant: state.restaurant.restaurantData || {},
  createStatus: state.category.create_status,
  deleteCreateStatus: state.category.delete_status,
  globalData: state.menu.globalData,
  role: state.login.role,
  singleRestaurant: state.restaurantsList.singleRestaurant,
});

const mapDispatchToProps = {
  getSingleRestaurant,
  closeCategoryChange,
  getSingleCategoryMenu,
  getCategories,
  deleteStatus,
  globalUpdateSave,
  getOneRestaurant,
};

const
  Container = connect(
    mapStateToProps,
    mapDispatchToProps,
  )(RestaurantMenu);

export default withRouter(Container);
