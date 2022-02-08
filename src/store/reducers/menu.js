import _ from 'lodash';
import {
  CREATE_MENU,
  SINGLE_MENU,
  DELETE_MENU,
  CREATE_MENU_CHANGE,
  DELETE_MENU_CHANGE_STATUS,
  CLOSE_MENU_CHANGE,
  GET_SINGLE_CATEGORY_MENU,
  UPDATE_SINGLE_AVAILABLE,
  UPDATE_MENU,
  DELETE_STATUS,
  GLOBAL_UPDATE_CHANGE,
  GLOBAL_UPDATE_SAVE,
  ADD_ITEM_TYPE,
  TYPE_CHANGE_VALUE,
} from '../actions/menu';

const initialState = {
  menuData: {},
  errors: {},
  create_status: '',
  update_status: '',
  delete_status: '',
  menus: {},
  prices: [],
  categoryName: '',
  deletedItems: [],
  single_menu: [],
  sourceId: '',
  totalPages: 1,
  offset: 5,
  globalData: [],
  image: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_MENU_CHANGE: {
      const {
        path,
        value,
      } = action.payload;
      const {
        menuData,
        errors,
      } = state;

      _.set(menuData, path, value);

      delete errors.name;

      return {
        ...state,
        menuData: { ...menuData },
        errors: { ...errors },
      };
    }

    case SINGLE_MENU.SUCCESS: {
      const { data: { result } } = action.payload;

      return {
        ...state,
        single_menu: result,
        sourceId: result[0].sourceId,
        image: result[0].image,
      };
    }

    case UPDATE_MENU.SUCCESS: {
      return {
        ...state,
        update_status: 'Menu item has been updated!',
      };
    }

    case UPDATE_MENU.FAIL: {
      return {
        ...state,
        errors: action.payload.data.errors,
      };
    }

    case CREATE_MENU.SUCCESS: {
      const { data } = action.payload;
      const { menuData } = state;

      _.set(menuData, 'sourceId', data.result.sourceId);

      return {
        ...state,
        create_status: 'Menu item has been created!',
      };
    }

    case CREATE_MENU.FAIL: {
      return {
        ...state,
        errors: action.payload.data.errors,
      };
    }

    case DELETE_MENU.SUCCESS: {
      const { id } = action.payload;
      const deletedItems = [...state.deletedItems];

      deletedItems.push(id);

      return {
        ...state,
        deletedItems,
        delete_status: 'Menu item has been deleted!',
      };
    }

    case DELETE_MENU_CHANGE_STATUS: {
      return {
        ...state,
        errors: {},
      };
    }

    case DELETE_STATUS: {
      return {
        ...state,
        delete_status: '',
        create_status: '',
        update_status: '',
      };
    }

    case CLOSE_MENU_CHANGE: {
      return {
        ...state,
        menuData: {},
        errors: {},
        single_menu: [],
        status: '',
        image: [],
        sourceId: '',
      };
    }

    case GET_SINGLE_CATEGORY_MENU.REQUEST: {
      const { bool } = action.payload;

      if (bool) {
        return {
          ...state,
          menus: {},
        };
      }
      return {
        ...state,
      };
    }

    case GET_SINGLE_CATEGORY_MENU.SUCCESS: {
      const {
        data,
        page,
      } = action.payload;
      let { name } = action.payload;
      let menus = { ...state.menus };
      let prices = [...state.prices];

      if (!name) {
        name = state.categoryName;
      }

      if (page === 1) {
        menus = { [name]: data.result };
      } else {
        menus = {
          ...menus,
          [name]: [...data.result, ...menus[name]],
        };
      }

      menus[name] = _.orderBy(menus[name], 'createdAt');
      menus[name] = _.uniqBy(menus[name], 'id');
      menus[name] = _.orderBy(menus[name], 'createdAt', 'desc');

      const p = _.uniqBy(Object.values(menus)
        .flat(1), 'id')
        .map((i) => {
          if (!Object.keys(prices)
            .some((d) => d.sourceId)) {
            return {
              sourceId: i.sourceId,
              price: i.price,
            };
          }
        });

      prices = [...prices, ...p];

      return {
        ...state,
        menus,
        prices,
        categoryName: name,
        totalPages: data.totalPage,
      };
    }

    case UPDATE_SINGLE_AVAILABLE.SUCCESS: {
      const { id } = action.payload;
      const {
        categoryName,
        menus,
      } = state;
      menus[categoryName] = [...menus[categoryName]].map((i) => {
        if (id === i.id) {
          return {
            ...i,
            available: !i.available,
          };
        }
        return i;
      });

      return {
        ...state,
        menus: { ...menus },
      };
    }

    case GLOBAL_UPDATE_CHANGE: {
      const {
        id,
        price,
        index: ind,
      } = action.payload;

      const globalData = [...state.globalData];

      const data = {};
      if (ind !== undefined) {
        data.id = id;
        data.price = price;
        data.index = ind;

        if (globalData.find((d) => d.index === ind && d.id === id)) {
          globalData.forEach((d, i) => {
            if (d.index === ind && d.id === id) {
              globalData.splice(i, 1, data);
            }
          });

          return {
            ...state,
            globalData: [...globalData],
          };
        }
      } else {
        data.id = id;
        data.price = price;

        _.find(globalData, (i, index) => {
          if (i.id === id) {
            globalData.splice(index, 1);
          }
        });
      }

      globalData.push(data);

      return {
        ...state,
        globalData: [...globalData],
      };
    }

    case GLOBAL_UPDATE_SAVE.SUCCESS: {
      return {
        ...state,
        globalData: [],
      };
    }

    case ADD_ITEM_TYPE: {
      const { menuData } = state;

      _.set(menuData, 'typesEn', [...(menuData.typesEn || []),
        {
          type: '',
          price: 0,
          main: false,
        }]);

      _.set(menuData, 'typesRu', [...(menuData.typesRu || []),
        {
          type: '',
          price: 0,
          main: false,
        }]);

      _.set(menuData, 'typesAm', [...(menuData.typesAm || []),
        {
          type: '',
          price: 0,
          main: false,
        }]);

      return {
        ...state,
        menuData: { ...menuData },
      };
    }

    case TYPE_CHANGE_VALUE: {
      const {
        path,
        value,
        lang,
        index,
      } = action.payload;

      const { menuData } = state;
      if (path === 'price') {
        _.set(menuData.typesEn[index], path, value);
        _.set(menuData.typesRu[index], path, value);
        _.set(menuData.typesAm[index], path, value);
      } else if (path === 'main') {
        _.map(menuData.typesEn, (el, ind) => {
          _.set(el, path, false);

          if (ind === index) {
            _.set(el, path, `${value}`);
          }
        });
        _.map(menuData.typesRu, (el, ind) => {
          _.set(el, path, false);

          if (ind === index) {
            _.set(el, path, `${value}`);
          }
        });
        _.map(menuData.typesAm, (el, ind) => {
          _.set(el, path, false);

          if (ind === index) {
            _.set(el, path, `${value}`);
          }
        });
      } else {
        _.map(menuData[`types${lang}`], (el, ind) => {
          if (ind === index) {
            _.set(el, path, `${value}`);
          }
        });
      }

      return {
        ...state,
        menuData: { ...menuData },
      };
    }

    default: {
      return state;
    }
  }
}
