import React, { Component } from 'react';
import { Delete, Edit, ExpandMore } from '@material-ui/icons';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  FormGroup,
  Snackbar,
  Switch,
  Typography,
} from '@material-ui/core';
import memoizeOne from 'memoize-one';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Alert } from '@material-ui/lab';
import {
  getSingleCategoryMenu,
  updateSingleAvailable,
  deleteMenu,
  getSingleMenu,
  closeMenuChange,
  deleteMenuStatus,
  globalUpdateChange,
} from '../../store/actions/menu';
import {
  getCategories,
} from '../../store/actions/category';
import DeleteCategoryModal from '../Modals/DeleteCategoryModal';
import CreateMenuModal from '../Modals/CreateMenuModal';
import MenuAccordion from './MenuAccordion';

class MenuItemTypography extends Component {
  static propTypes = {
    getSingleCategoryMenu: PropTypes.func.isRequired,
    updateSingleAvailable: PropTypes.func.isRequired,
    deleteMenu: PropTypes.func.isRequired,
    getSingleMenu: PropTypes.func.isRequired,
    closeMenuChange: PropTypes.func.isRequired,
    getCategories: PropTypes.func.isRequired,
    deleteMenuStatus: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    updateStatus: PropTypes.string.isRequired,
    deleteCreateStatus: PropTypes.string.isRequired,
    menuItem: PropTypes.object.isRequired,
    disable: PropTypes.bool.isRequired,
    globalUpdateChange: PropTypes.func.isRequired,
  };

  menu = memoizeOne((item) => {
    if (_.isEmpty(item)) {
      return;
    }
    const { formData } = this.state;

    _.map(item, (value, path) => {
      _.set(formData, path, value);
    });

    this.setState({
      formData: { ...formData },
    });
  }, _.isEqual);

  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      deleteId: '',
      deleteCategoryModal: false,
      updateMenuModal: false,
      menuAvailable: false,
      defaultValue: '',
      menuItemBool: false,
    };
  }

  toggleMenuChange = async () => {
    const availableData = {};
    const {
      formData,
    } = this.state;

    _.map(formData, (value, path) => {
      _.set(availableData, path, value);
    });

    availableData.available = !availableData.available;
    availableData.restaurantId = this.props.match.params.id;

    await this.props.updateSingleAvailable(availableData, availableData.id);

    this.setState({
      menuAvailable: true,
    });
  };

  openDeleteMenuModal = (id) => this.setState({
    deleteCategoryModal: true,
    deleteId: id,
  });

  closeDeleteMenuModal = () => this.setState({
    deleteCategoryModal: false,
    deleteId: '',
  });

  deleteMenuItem = async () => {
    const { deleteId } = this.state;
    await this.props.deleteMenu(deleteId, this.props.match.params.id);
    this.closeDeleteMenuModal();
  };

  openEditMenuModal = async (sourceId, categoryId) => {
    await this.props.getSingleMenu(sourceId, categoryId);

    this.setState({
      updateMenuModal: true,
    });
  };

  closeEditMenuModal = async (categoryId) => {
    await this.props.getCategories(this.props.match.params.id, this.props.match.params.resId, 'en');
    await this.props.getSingleCategoryMenu(categoryId, this.props.match.params.id, this.props.match.params.resId, 'en', 1);
    await this.props.closeMenuChange();
    this.setState({
      updateMenuModal: false,
    });
  };

  closeAvailable = () => {
    this.setState({
      menuAvailable: false,
    });
  };

  priceChange = (id, value) => {
    const { formData } = this.state;
    const { menuItem } = this.props;

    if (value >= 0 && !_.isEmpty(value)) {
      this.props.globalUpdateChange(id, value);

      this.setState({
        formData: {
          ...formData,
          price: value,
        },
      });
    } else if (_.isEmpty(value)) {
      this.props.globalUpdateChange(id, menuItem.price);

      this.setState({
        formData: {
          ...formData,
          price: value,
        },
      });
    } else {
      this.setState({
        formData: {
          ...formData,
          price: menuItem.price,
        },
      });
    }
  };

  openMenu = () => {
    const { menuItemBool } = this.state;

    this.setState({
      menuItemBool: !menuItemBool,
    });
  };

  render() {
    const {
      menuItem,
      updateStatus,
      deleteCreateStatus,
      disable,
    } = this.props;

    const {
      formData,
      deleteCategoryModal,
      updateMenuModal,
      menuAvailable,
      defaultValue,
      menuItemBool,
    } = this.state;

    this.menu(menuItem, formData.available);

    const mainType = _.find(formData.types, (d) => d.main === 'true');

    return (
      <>
        {formData.price
          ? (
            <Typography component="div" className="menuItemBlock">
              <div className="menuItemGlobalInfo">
                <div className="menuItemInfo">
                  <img src={formData.image ? formData.image[0] : null} alt={formData.name} />
                  <p
                    title={formData.name}
                  >
                    {_.truncate(formData.name, {
                      length: 10,
                      separator: '...',
                    })}
                  </p>
                  <input
                    type="number"
                    name="price"
                    value={defaultValue || formData.price}
                    onChange={(ev) => this.priceChange(formData.sourceId, ev.target.value)}
                    disabled={disable}
                    className="priceInput"
                  />
                  <span>amd</span>
                </div>
                <FormGroup className="menuSwitch">
                  <FormControlLabel
                    control={(
                      <Switch
                        size="medium"
                        checked={formData.available}
                        onChange={this.toggleMenuChange}
                      />
                    )}
                    label={formData.available ? 'Available' : 'Not available'}
                  />
                </FormGroup>
                <div className="menuItemButtons">
                  <Edit
                    onClick={() => this.openEditMenuModal(formData.sourceId, formData.categoryId)}
                  />
                  <Delete
                    className="deleteIcon"
                    onClick={() => this.openDeleteMenuModal(formData.id)}
                  />
                </div>
              </div>
            </Typography>
          ) : (
            <Accordion
              className="CategoryBlock"
              expanded={menuItemBool}
            >
              <AccordionSummary
                expandIcon={(
                  <ExpandMore onClick={this.openMenu} />
                )}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                className="categoryWorkBlock"
              >
                <div className="menuItemGlobalInfo">
                  <div className="menuItemInfo">
                    <img src={formData.image ? formData.image[0] : null} alt={formData.name} />
                    <p
                      title={formData.name}
                    >
                      {_.truncate(formData.name, {
                        length: 10,
                        separator: '...',
                      })}
                    </p>
                    <p>{mainType.price}</p>
                    <span>amd</span>
                  </div>
                  <FormGroup className="menuSwitch">
                    <FormControlLabel
                      control={(
                        <Switch
                          size="medium"
                          checked={formData.available}
                          onChange={this.toggleMenuChange}
                        />
                      )}
                      label={formData.available ? 'Available' : 'Not available'}
                    />
                  </FormGroup>
                  <div className="menuItemButtons">
                    <Edit
                      onClick={() => this.openEditMenuModal(formData.sourceId, formData.categoryId)}
                    />
                    <Delete
                      className="deleteIcon"
                      onClick={() => this.openDeleteMenuModal(formData.id)}
                    />
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails
                ref={(ref) => {
                  this.ref = ref;
                }}
                className="typesBlock"
              >
                {_.map(formData.types, (el, index) => (
                  <MenuAccordion
                    key={index}
                    disable={disable}
                    el={el}
                    sourceId={formData.sourceId}
                    index={index}
                  />
                ))}
              </AccordionDetails>
            </Accordion>
          )}
        {deleteCategoryModal
          ? (
            <DeleteCategoryModal
              close={this.closeDeleteMenuModal}
              deleteCategory={this.deleteMenuItem}
              text="Are you sure you want to delete this menu?"
            />
          ) : null}
        {updateMenuModal
          ? (
            <CreateMenuModal
              menuProcess="Update menu"
              categoryId={formData.categoryId}
              close={this.closeEditMenuModal}
            />
          ) : null}
        {updateStatus
          ? (
            <Snackbar
              className="errorBar"
              open={!_.isEmpty(updateStatus)}
              autoHideDuration={2000}
              onClose={this.props.deleteMenuStatus}
            >
              <Alert onClose={this.props.deleteMenuStatus} severity="success">
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
              onClose={this.props.deleteMenuStatus}
            >
              <Alert onClose={this.props.deleteMenuStatus} severity="error">
                {deleteCreateStatus}
              </Alert>
            </Snackbar>
          ) : null}
        {menuAvailable
          ? (
            <Snackbar
              className="errorBar"
              autoHideDuration={2000}
              open={menuAvailable}
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
  currentPage: state.menu.currentPage,
  updateStatus: state.menu.update_status,
  deleteCreateStatus: state.menu.delete_status,
});

const mapDispatchToProps = {
  getSingleCategoryMenu,
  updateSingleAvailable,
  deleteMenu,
  getSingleMenu,
  closeMenuChange,
  getCategories,
  deleteMenuStatus,
  globalUpdateChange,
};
const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MenuItemTypography);

export default withRouter(Container);
