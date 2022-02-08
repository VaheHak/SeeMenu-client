import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import {
  Accordion,
  AccordionSummary,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Tooltip,
  Button,
  AccordionDetails,
  Snackbar,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import {
  AddBox,
  Delete,
  Edit,
  ExpandMore,
  Menu,
} from '@material-ui/icons';

import memoizeOne from 'memoize-one';
import { Alert } from '@material-ui/lab';
import {
  getSingleCategory,
  getCategories,
  closeCategoryChange,
  deleteCategory,
  updateCategoryAvailable,
  deleteStatus,
} from '../../store/actions/category';
import CreateCategoryModal from '../Modals/CreateCategoryModal';
import DeleteCategoryModal from '../Modals/DeleteCategoryModal';
import CreateMenuModal from '../Modals/CreateMenuModal';
import {
  closeMenuChange,
  getSingleCategoryMenu,
  deleteMenuStatus,
} from '../../store/actions/menu';
import MenuItemTypography from './MenuItemTypography';

class CategoryAccordion extends Component {
  static propTypes = {
    getSingleCategory: PropTypes.func.isRequired,
    getCategories: PropTypes.func.isRequired,
    closeCategoryChange: PropTypes.func.isRequired,
    deleteCategory: PropTypes.func.isRequired,
    updateCategoryAvailable: PropTypes.func.isRequired,
    closeMenuChange: PropTypes.func.isRequired,
    openCategory: PropTypes.func.isRequired,
    getSingleCategoryMenu: PropTypes.func.isRequired,
    deleteStatus: PropTypes.func.isRequired,
    deleteMenuStatus: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    updateStatus: PropTypes.string.isRequired,
    createStatus: PropTypes.string.isRequired,
    categoryId: PropTypes.any.isRequired,
    category: PropTypes.object.isRequired,
    menus: PropTypes.object.isRequired,
    deletedItems: PropTypes.array.isRequired,
    offset: PropTypes.any.isRequired,
    totalPages: PropTypes.any.isRequired,
    disable: PropTypes.bool.isRequired,
  };

  category = memoizeOne((category) => {
    if (_.isEmpty(category)) {
      return;
    }

    const { formData } = this.state;

    _.map(category, (value, path) => {
      _.set(formData, path, value);
    });

    this.setState({
      formData,
    });
  }, _.isEqual);

  constructor(props) {
    super(props);
    this.state = {
      editCategory: false,
      deleteCategoryModal: false,
      deleteId: '',
      createMenu: false,
      formData: {},
      currentPage: 1,
      categoryAvailable: false,
    };
  }

  toggleCategoryChange = async () => {
    const availableData = {};
    const { formData } = this.state;

    _.map(formData, (value, path) => {
      _.set(availableData, path, value);
    });

    availableData.available = !availableData.available;
    formData.available = !formData.available;
    await this.props.updateCategoryAvailable(availableData);
    await this.props.getCategories(this.props.match.params.id, this.props.match.params.resId, 'en');
    this.setState({
      formData,
      categoryAvailable: true,
    });
  };

  openEditCategoryModal = async (id) => {
    await this.props.getSingleCategory(id);

    this.setState({
      editCategory: true,
    });
  };

  closeEditCategoryModal = async () => {
    await this.props.getCategories(this.props.match.params.id, this.props.match.params.resId, 'en');
    await this.props.closeCategoryChange();

    this.setState({
      editCategory: false,
    });
  };

  openDeleteCategoryModal = (id) => {
    this.setState({
      deleteCategoryModal: true,
      deleteId: id,
    });
  };

  closeDeleteCategoryModal = () => this.setState({
    deleteCategoryModal: false,
    deleteId: '',
  });

  deleteCategory = async () => {
    await this.props.deleteCategory(this.state.deleteId, this.props.match.params.id);
    await this.props.getCategories(this.props.match.params.id, this.props.match.params.resId, 'en');
    this.closeDeleteCategoryModal();
  };

  openCreateMenuModal = () => this.setState({ createMenu: true });

  closeCreateMenuModal = async (catId) => {
    await this.props.getCategories(this.props.match.params.id, this.props.match.params.resId, 'en');
    await this.props.getSingleCategoryMenu(catId, this.props.match.params.id, this.props.match.params.resId, 'en', 1);
    await this.props.closeMenuChange();
    this.setState({ createMenu: false });
  };

  handleScroll = async (id) => {
    const {
      totalPages,
      offset,
    } = this.props;
    const { currentPage } = this.state;
    const {
      scrollHeight,
      scrollTop,
    } = this.ref;
    const { height } = this.ref.getBoundingClientRect();
    if (scrollHeight <= height + scrollTop + offset && totalPages >= currentPage + 1) {
      await this.props.getSingleCategoryMenu(id, this.props.match.params.id, this.props.match.params.resId, 'en', currentPage + 1);
      this.setState({
        currentPage: currentPage + 1,
      });
    } else {
      this.setState({
        currentPage: 1,
      });
    }
  };

  closeAvailable = () => {
    this.setState({
      categoryAvailable: false,
    });
  };

  render() {
    const {
      editCategory,
      deleteCategoryModal,
      createMenu,
      formData,
      categoryAvailable,
    } = this.state;

    const {
      category,
      menus,
      categoryId,
      openCategory,
      deletedItems,
      updateStatus,
      createStatus,
      disable,
    } = this.props;

    this.category(category);

    return (
      <>
        <Accordion
          className="CategoryBlock"
          expanded={categoryId === formData.sourceId}
        >
          <AccordionSummary
            expandIcon={(
              <ExpandMore onClick={() => openCategory(
                formData.sourceId,
                formData.restBranchId,
                formData.lang,
                _.camelCase(formData.name),
              )}
              />
            )}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            className="categoryWorkBlock"
          >
            <div>
              <div className="categoryNameBlock">
                <div className="menuButton">
                  <Menu
                    onClick={() => openCategory(
                      formData.sourceId,
                      formData.restBranchId,
                      formData.lang,
                      _.camelCase(formData.name),
                    )}
                  />
                  <p
                    onClick={() => openCategory(
                      formData.sourceId,
                      formData.restBranchId,
                      formData.lang,
                      _.camelCase(formData.name),
                    )}
                    className="heading"
                    title={formData.name}
                  >
                    {_.truncate(formData.name, {
                      length: 10,
                      separator: '...',
                    })}
                  </p>
                </div>
              </div>
              <FormGroup className="categorySwitch">
                <FormControlLabel
                  control={(
                    <Switch
                      size="medium"
                      checked={formData.available}
                      onChange={this.toggleCategoryChange}
                    />
                  )}
                  label={formData.available ? 'Available' : 'Not available'}
                />
              </FormGroup>
              <div className="categoryControlBlock">
                <Tooltip title="Add menu" arrow onClick={() => this.openCreateMenuModal()}>
                  <Button>
                    <AddBox />
                  </Button>
                </Tooltip>
                <Tooltip
                  title="Edit"
                  arrow
                  onClick={() => this.openEditCategoryModal(formData.sourceId)}
                >
                  <Button>
                    <Edit />
                  </Button>
                </Tooltip>
                <Tooltip
                  title="Delete"
                  arrow
                  onClick={() => this.openDeleteCategoryModal(formData.id)}
                >
                  <Button>
                    <Delete
                      className="deleteIcon"
                    />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails
            className="menuItems"
            ref={(ref) => {
              this.ref = ref;
            }}
            onScroll={() => this.handleScroll(formData.id)}
          >
            {Object.keys(menus)
              .some((m) => m === _.camelCase(formData.name))
              ? menus[_.camelCase(formData.name)]?.filter((i) => (
                !deletedItems.includes(i.id)))
                .map((item) => (
                  <MenuItemTypography
                    key={item.id}
                    menuItem={item}
                    disable={disable}
                  />
                )) : null}
          </AccordionDetails>
        </Accordion>
        {editCategory
          ? (
            <CreateCategoryModal
              categoryProcess="Update category"
              close={this.closeEditCategoryModal}
            />
          ) : null}
        {deleteCategoryModal
          ? (
            <DeleteCategoryModal
              close={this.closeDeleteCategoryModal}
              deleteCategory={this.deleteCategory}
              text="Are you sure you want to delete this category? The entire menu associated with this category will be removed."
            />
          ) : null}
        {createMenu
          ? (
            <CreateMenuModal
              close={this.closeCreateMenuModal}
              menuProcess="Add menu item"
              categoryId={formData.sourceId}
            />
          )
          : null}
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
        {createStatus
          ? (
            <Snackbar
              className="errorBar"
              open={!_.isEmpty(createStatus)}
              autoHideDuration={2000}
              onClose={this.props.deleteMenuStatus}
            >
              <Alert onClose={this.props.deleteMenuStatus} severity="success">
                {createStatus}
              </Alert>
            </Snackbar>
          ) : null}
        {categoryAvailable
          ? (
            <Snackbar
              className="errorBar"
              open={categoryAvailable}
              autoHideDuration={2000}
              onClose={this.closeAvailable}
            >
              <Alert onClose={this.closeAvailable} severity="success">
                {formData.name}
                {' '}
                {formData.available ? 'available!' : 'not available!'}
              </Alert>
            </Snackbar>
          ) : null}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  menus: state.menu.menus,
  deletedItems: state.menu.deletedItems,
  totalPages: state.menu.totalPages,
  offset: state.menu.offset,
  updateStatus: state.category.update_status,
  createStatus: state.menu.create_status,
});

const mapDispatchToProps = {
  getSingleCategory,
  getSingleCategoryMenu,
  getCategories,
  closeCategoryChange,
  deleteCategory,
  updateCategoryAvailable,
  closeMenuChange,
  deleteStatus,
  deleteMenuStatus,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CategoryAccordion);

export default withRouter(Container);
