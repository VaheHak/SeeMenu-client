import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { InputAdornment } from '@material-ui/core';
import FileInput from '../FileInput';
import Input from '../Inputs/Input';
import {
  createRestaurant,
  createRestaurantChange,
  updateRestaurant,
  deleteRestaurant,
  getBranches,
} from '../../store/actions/restaurant';
import DeleteCategoryModal from '../Modals/DeleteCategoryModal';

class RestaurantCreate extends Component {
  static propTypes = {
    updateRestaurant: PropTypes.func.isRequired,
    createRestaurant: PropTypes.func.isRequired,
    createRestaurantChange: PropTypes.func.isRequired,
    deleteRestaurant: PropTypes.func.isRequired,
    getBranches: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    button: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    restaurantId: PropTypes.any.isRequired,
    restaurantName: PropTypes.string.isRequired,
    restaurantAddress: PropTypes.string.isRequired,
    restaurantPhone: PropTypes.string.isRequired,
    restaurantLink: PropTypes.string.isRequired,
    restaurantSub: PropTypes.string.isRequired,
    restaurantTime: PropTypes.string.isRequired,
    restaurantLogo: PropTypes.string.isRequired,
    restaurantCover: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      deleteRestaurantModal: false,
    };
  }

  handleSubmit = async (ev) => {
    ev.preventDefault();
    if (this.props.button === 'Register') {
      const { formData } = this.props;

      _.map(formData, (value, path) => {
        if (path === 'link') {
          formData.link = `https://seemenu.am/${value}`;
        }
      });

      const { payload: { data } } = await this.props.createRestaurant(this.props.formData);

      if (!data.errors) {
        this.props.close();
      }
    }

    if (this.props.button === 'Update') {
      const { payload: { data } } = await this.props.updateRestaurant(this.props.formData);
      if (!data.errors) {
        this.props.close(this.props.formData.branchId);
      }
    }

    if (this.props.button === 'Create') {
      const { formData } = this.props;
      formData.branchId = this.props.restaurantId || this.props.match.params.id;

      const { payload: { data } } = await this.props.createRestaurant(formData);

      if (!data.errors) {
        this.props.close();
      }
    }
  }

  openDeleteRestaurantModal = () => this.setState({ deleteRestaurantModal: true })

  closeDeleteRestaurantModal = () => this.setState({ deleteRestaurantModal: false })

  deleteRestaurant = async () => {
    await this.props.deleteRestaurant(this.props.formData.id);
    await this.props.getBranches(this.props.formData.branchId);
    this.closeDeleteRestaurantModal();
    this.props.close();
  }

  restaurantChange = (key, value) => {
    this.props.createRestaurantChange(key, value);
  }

  render() {
    const {
      restaurantName,
      restaurantAddress,
      restaurantPhone,
      restaurantLink,
      restaurantSub,
      restaurantTime,
      restaurantLogo,
      restaurantCover,
      button,
      errors,
      formData,
    } = this.props;

    const {
      deleteRestaurantModal,
    } = this.state;

    return (
      <form className="restaurantRegister" onSubmit={this.handleSubmit}>
        <div className="regGroup">
          <Input
            className="inputArea"
            label={restaurantName}
            type="text"
            helperText={errors?.name}
            onChange={(ev) => this.restaurantChange('name', ev.target.value)}
            value={formData?.name}
          />
          <Input
            className="inputArea"
            label={restaurantAddress}
            type="text"
            helperText={errors?.address}
            onChange={(ev) => this.restaurantChange('address', ev.target.value)}
            value={formData?.address}
          />
        </div>
        <div className="regGroup">
          <Input
            className="inputArea"
            label={restaurantPhone}
            type="tel"
            helperText={errors?.phone}
            onChange={(ev) => this.restaurantChange('phone', ev.target.value)}
            value={formData?.phone}
          />
          <Input
            className="inputArea"
            label={restaurantLink}
            type="text"
            InputProps={{
              startAdornment: <InputAdornment position="start">https://seemenu.am/</InputAdornment>,
            }}
            helperText={errors?.link}
            onChange={(ev) => this.restaurantChange('link', ev.target.value)}
            value={formData?.link?.length > 19 ? formData.link.slice(19) : formData.link}
          />
        </div>
        <div className="regGroup">
          <Input
            className="inputArea"
            label={restaurantSub}
            type="text"
            helperText={errors?.subName}
            onChange={(ev) => this.restaurantChange('subName', ev.target.value)}
            value={formData?.subName}
          />
          <Input
            className="inputArea"
            label={restaurantTime}
            type="text"
            helperText={errors?.timing}
            onChange={(ev) => this.restaurantChange('timing', ev.target.value)}
            value={formData?.timing}
          />
        </div>
        {/* <label> */}
        {/*    <p>Restaurant description</p> */}
        {/*    <textarea name="description" */}
        {/*              value={formData.description ? formData.description : ""} */}
        {/*              onChange={(ev) => this.restaurantChange(ev.target.name,
         // ev.target.value)}/> */}
        {/*    /!*{errors.description ?*!/ */}
        {/*    /!*    <span className='registerError'>{errors.description}</span> : null}*!/ */}
        {/* </label> */}
        <div className="regGroup images">
          <label className="coverLabel">
            <p className="restaurantImageText">{restaurantLogo}</p>
            <FileInput
              accept="image/*"
              file={formData?.logo}
              onChange={(ev, file) => this.restaurantChange('logo', file)}
            />
            {errors.logo ? <span className="registerError">{errors.logo}</span> : null}
          </label>
          <label className="coverLabel">
            <p className="restaurantImageText">{restaurantCover}</p>
            <FileInput
              accept="image/*"
              file={formData?.cover}
              onChange={(ev, file) => this.restaurantChange('cover', file)}
            />
            {errors.cover ? <span className="registerError">{errors.cover}</span> : null}
          </label>
        </div>
        <div className="regBlock">
          <button className="buttonDesign" type="submit">{button}</button>
          {button === 'Update'
            ? (
              <button
                className="buttonDesign Delete"
                type="button"
                onClick={this.openDeleteRestaurantModal}
              >
                Delete
              </button>
            )
            : null}

        </div>
        {deleteRestaurantModal
          ? (
            <DeleteCategoryModal
              close={this.closeDeleteRestaurantModal}
              deleteCategory={this.deleteRestaurant}
              text=" Are you sure you want to delete this restaurant? The entire branches associated with this restaurant will be removed."
            />
          ) : null}
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  formData: state.restaurant.restaurantData || {},
  errors: state.restaurant.errors || {},
});

const mapDispatchToProps = {
  createRestaurantChange,
  updateRestaurant,
  createRestaurant,
  deleteRestaurant,
  getBranches,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RestaurantCreate);

export default withRouter(Container);
