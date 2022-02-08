import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import Select from 'react-select';
import { withRouter } from 'react-router-dom';
import { Add } from '@material-ui/icons';
import {
  createMenu,
  createMenuChange,
  updateMenu,
  addItemType,
  typeChangeValue,
} from '../../store/actions/menu';
import Textarea from '../Inputs/Textarea';
import Input from '../Inputs/Input';
import SubMenu from '../SubMenu';
import MultipleFIleInput from '../Inputs/MultipleFIleInput';

class MenuCreate extends Component {
  static propTypes = {
    createMenu: PropTypes.func.isRequired,
    createMenuChange: PropTypes.func.isRequired,
    updateMenu: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    menuData: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    singleMenu: PropTypes.array.isRequired,
    categoryId: PropTypes.any.isRequired,
    errors: PropTypes.object.isRequired,
    button: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
    productDetail: PropTypes.string.isRequired,
    productPrice: PropTypes.string.isRequired,
    menuImage: PropTypes.string.isRequired,
    sourceId: PropTypes.any,
    image: PropTypes.array.isRequired,
    addItemType: PropTypes.func.isRequired,
    typeChangeValue: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sourceId: undefined,
  };

  initMenu = memoizeOne((menu, l) => {
    if (!_.isEmpty(menu)) {
      this.props.createMenuChange('available', menu.available);
      this.props.createMenuChange(`name${l}`, menu.name);
      this.props.createMenuChange('image', menu.image);
      this.props.createMenuChange(`vegan${l}`, menu.vegan);
      this.props.createMenuChange(`description${l}`, menu.description);
      this.props.createMenuChange('restaurantId', menu.restaurantId);
      this.props.createMenuChange('restaurantBranchId', menu.restaurantBranchId);
      this.props.createMenuChange('categoryId', menu.categoryId);
      this.props.createMenuChange('sourceId', menu.sourceId);
      this.props.createMenuChange('lang', _.toLower(l));
      this.props.createMenuChange('id', menu.id);

      if (menu.price !== null) {
        this.props.createMenuChange('price', menu.price);
      }

      if (menu.types) {
        this.props.createMenuChange(`types${l}`, menu.types);

        this.setState({
          priceBool: false,
        });
      }
    }
  }, _.isEqual);

  constructor(props) {
    super(props);
    this.state = {
      priceBool: true,
      vegan: {
        value: false,
        label: 'Non Veg',
      },
    };
    this.vegan = [
      {
        value: true,
        label: 'Veg',
      },
      {
        value: false,
        label: 'Non Veg',
      },
    ];
  }

  componentDidMount() {
    const { menuData } = this.props;
    this.props.createMenuChange(`vegan${this.props.lang}`, this.state.vegan.value);
    this.props.createMenuChange('lang', _.lowerCase(this.props.lang));

    if (menuData[`types${this.props.lang}`]) {
      this.setState({
        priceBool: false,
      });
    }
  }

  menuChange = (path, value) => {
    this.props.createMenuChange(path, value);
  };

  saveMenu = async (ev) => {
    ev.preventDefault();
    const { menuData } = this.props;
    const formData = {};

    if (_.isEmpty(this.props.singleMenu)) {
      formData.name = menuData[`name${this.props.lang}`];
      formData.description = menuData[`description${this.props.lang}`];
      formData.price = menuData.price;
      formData.vegan = menuData[`vegan${this.props.lang}`];
      formData.image = menuData.image;
      formData.restaurantId = this.props.match.params.id;
      formData.restaurantBranchId = this.props.match.params.resId;
      formData.categoryId = this.props.categoryId;
      formData.lang = _.toLower(this.props.lang);
      if (menuData.sourceId) {
        formData.sourceId = menuData.sourceId;
      }
      if (menuData[`types${this.props.lang}`]) {
        formData.types = menuData[`types${this.props.lang}`];
      }

      await this.props.createMenu(formData);
    } else {
      formData.lang = _.toLower(this.props.lang);
      formData.restaurantId = this.props.match.params.id;
      formData.available = menuData.available;
      formData.name = menuData[`name${this.props.lang}`];
      formData.image = menuData.image || this.props.image;
      formData.price = menuData.price;
      formData.vegan = menuData.vegan;
      formData.description = menuData[`description${this.props.lang}`];
      formData.restaurantBranchId = this.props.match.params.resId;
      formData.categoryId = this.props.categoryId;
      formData.sourceId = this.props.sourceId;
      formData.id = menuData.id;

      if (menuData[`types${this.props.lang}`]) {
        formData.types = menuData[`types${this.props.lang}`];
        formData.price = undefined;
      }

      await this.props.updateMenu(formData);
    }
  };

  selectVegan = (vegan) => {
    this.menuChange('vegan', vegan.value);

    this.setState({
      vegan,
    });
  };

  addMenuItemType = () => {
    this.props.addItemType();

    this.setState({
      priceBool: false,
    });
  };

  menuTypeChange = (path, value, lang, index) => {
    this.props.typeChangeValue(path, value, lang, index);
  };

  render() {
    const {
      productName,
      productDetail,
      productPrice,
      menuImage,
      lang,
      button,
      errors,
      menuData,
      singleMenu,
    } = this.props;

    const {
      vegan,
      priceBool,
    } = this.state;

    if (!_.isEmpty(singleMenu)) {
      let langMenu = {};
      langMenu = singleMenu.find((i) => i.lang === _.toLower(lang));
      if (langMenu) {
        this.initMenu(langMenu, lang);
      } else {
        this.initMenu({}, lang);
      }
    }

    return (
      <div className="categoryRegisterLanguage">
        <form onSubmit={this.saveMenu} className="categoryForm">
          <Input
            className="inputArea"
            label={productName}
            type="text"
            helperText={errors?.name}
            onChange={(ev) => this.menuChange(`name${lang}`, ev.target.value)}
            value={menuData[`name${lang}`] || ''}
          />
          <Textarea
            className="inputArea"
            label={productDetail}
            helperText={errors?.description}
            type="text"
            onChange={(ev) => this.menuChange(`description${lang}`, ev.target.value)}
            value={menuData[`description${lang}`] || ''}
          />
          {priceBool ? (
            <Input
              className="inputArea"
              label={productPrice}
              type="number"
              helperText={errors?.price}
              onChange={(ev) => this.menuChange(`price${lang}`, ev.target.value)}
              value={menuData[`price${lang}`] || ''}
            />
          ) : null}
          <Select
            className="veganSelectBlock"
            classNamePrefix="vegan"
            value={vegan}
            onChange={this.selectVegan}
            options={this.vegan}
          />
          <div className="typesBlock">
            {!priceBool
              ? (menuData[`types${lang}`]
                ? (_.map(menuData[`types${lang}`], (el, index) => (
                  <SubMenu
                    key={index}
                    el={el}
                    lang={lang}
                    change={this.menuTypeChange}
                    index={index}
                    names={menuData.types ? {
                      En: menuData.typesEn[index].type || '',
                      Ru: menuData.typesRu[index].type || '',
                      Am: menuData.typesAm[index].type || '',
                    } : null}
                  />
                )))
                : null
              )
              : null}
            <button
              type="button"
              className="addTypeItem"
              onClick={this.addMenuItemType}
            >
              <Add />
              Add another type
            </button>
          </div>
          <label className="categoryLabel">
            <p className="restaurantCategoryTittle">{menuImage}</p>
            <MultipleFIleInput
              accept="image/*"
              files={menuData?.image}
              onChange={(ev, files) => this.menuChange('image', files)}
            />
            {errors?.image ? <span className="categoryError">{errors.image}</span> : null}
          </label>
          <button type="submit" className="categoryRegisterBut">{button}</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  menuData: state.menu.menuData,
  errors: state.menu.errors,
  status: state.menu.status,
  singleMenu: state.menu.single_menu,
  sourceId: state.menu.sourceId,
  image: state.menu.image,
});

const mapDispatchToProps = {
  createMenu,
  createMenuChange,
  updateMenu,
  addItemType,
  typeChangeValue,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MenuCreate);

export default withRouter(Container);
