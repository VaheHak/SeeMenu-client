import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import { withRouter } from 'react-router-dom';
import {
  createCategoryChange, createCategory, updateCategory,
} from '../../store/actions/category';
import Input from '../Inputs/Input';
import FileInput from '../FileInput';

class CategoryCreate extends Component {
  static propTypes = {
    createCategoryChange: PropTypes.func.isRequired,
    createCategory: PropTypes.func.isRequired,
    updateCategory: PropTypes.func.isRequired,
    categoryData: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    singleCategory: PropTypes.array.isRequired,
    errors: PropTypes.object.isRequired,
    sourceId: PropTypes.any.isRequired,
    lang: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    categoryImage: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  };

  initCategories = memoizeOne((category, l) => {
    if (category) {
      this.props.createCategoryChange(`name${l}`, category.name || '');
      this.props.createCategoryChange('image', category.image || '');
      this.props.createCategoryChange('id', category.id || '');
      this.props.createCategoryChange('available', category.available || '');
      this.props.createCategoryChange('restaurantId', category.restaurantId || '');
      this.props.createCategoryChange('lang', _.toLower(l) || '');
      this.props.createCategoryChange('sourceId', this.props.sourceId || '');
    }
  }, _.isEqual);

  categoryChange = (key, value) => {
    this.props.createCategoryChange(key, value);
  };

  categorySave = async (ev) => {
    ev.preventDefault();

    const { categoryData } = this.props;
    const formData = {};

    if (_.isEmpty(this.props.singleCategory)) {
      formData.lang = _.toLower(this.props.lang);
      formData.restaurantId = this.props.match.params.id;
      if (this.props.match.params.id === this.props.match.params.resId) {
        formData.restBranchId = this.props.match.params.id;
      }
      formData.image = categoryData.image;
      formData.name = categoryData[`name${this.props.lang}`];
      if (categoryData.sourceId) {
        formData.sourceId = categoryData.sourceId;
      }

      await this.props.createCategory(formData);
    } else {
      formData.lang = _.toLower(this.props.lang);
      formData.restaurantId = this.props.match.params.resId;
      formData.name = categoryData[`name${this.props.lang}`];
      formData.image = this.props.image;
      formData.sourceId = this.props.sourceId;
      formData.restBranchId = this.props.match.params.id;
      formData.id = categoryData.id;

      await this.props.updateCategory(formData);
    }
  };

  render() {
    const {
      label,
      categoryImage,
      button,
      errors,
      categoryData,
      lang,
      singleCategory,
    } = this.props;
    if (!_.isEmpty(singleCategory)) {
      let langCategory = {};
      langCategory = singleCategory.find((i) => i.lang === _.toLower(lang));
      if (langCategory) {
        this.initCategories(langCategory, lang);
      } else {
        this.initCategories({}, lang);
      }
    }

    return (
      <div className="categoryRegisterLanguage">
        <form onSubmit={this.categorySave} className="categoryForm">
          <Input
            className="inputArea"
            label={label}
            type="text"
            helperText={errors?.name}
            onChange={(ev) => this.categoryChange(`name${lang}`, ev.target.value)}
            value={categoryData[`name${lang}`] || ''}
          />
          <label className="categoryLabel">
            <p className="restaurantCategoryTittle">{categoryImage}</p>
            <FileInput
              accept="image/*"
              file={categoryData?.image}
              onChange={(ev, file) => this.categoryChange('image', file)}
            />
            {errors.image ? <span className="categoryError">{errors.image}</span> : null}
          </label>
          <button type="submit" className="categoryRegisterBut">{button}</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  categoryData: state.category.categoryData,
  errors: state.category.errors,
  sourceId: state.category.sourceId,
  image: state.category.image,
  singleCategory: state.category.single_category,
});

const mapDispatchToProps = {
  createCategoryChange,
  createCategory,
  updateCategory,
};

const
  Container = connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CategoryCreate);

export default withRouter(Container);
