import { define } from '../../helpers/redux-request';
import Api from '../../Api';

export const CREATE_MENU = define('CREATE_MENU');

export function createMenu(formData) {
  return CREATE_MENU.request(() => Api.createMenu(formData))
    .takeLatest();
}

export const SINGLE_MENU = define('SINGLE_MENU');

export function getSingleMenu(sourceId, categoryId) {
  return SINGLE_MENU.request(() => Api.getSingleMenu(sourceId, categoryId))
    .takeLatest();
}

export const DELETE_MENU = define('DELETE_MENU');

export function deleteMenu(id, restaurantId) {
  return DELETE_MENU.request(() => Api.deleteMenu(id, restaurantId))
    .onSuccess((p) => {
      p.id = id;
    });
}

export const CREATE_MENU_CHANGE = 'CREATE_MENU_CHANGE';

export function createMenuChange(path, value) {
  return {
    type: CREATE_MENU_CHANGE,
    payload: {
      path,
      value,
    },
  };
}

export const DELETE_MENU_CHANGE_STATUS = 'DELETE_MENU_CHANGE_STATUS';

export function deleteMenuChangeStatus() {
  return {
    type: DELETE_MENU_CHANGE_STATUS,
  };
}

export const UPDATE_SINGLE_AVAILABLE = define('UPDATE_SINGLE_AVAILABLE');

export function updateSingleAvailable(formData, id) {
  return UPDATE_SINGLE_AVAILABLE.request(() => Api.updateSingleMenu(formData))
    .onSuccess((p) => {
      p.id = id;
      return p;
    })
    .takeLatest();
}

export const UPDATE_MENU = define('UPDATE_MENU');

export function updateMenu(formData) {
  return UPDATE_MENU.request(() => Api.updateMenu(formData))
    .takeLatest();
}

export const CLOSE_MENU_CHANGE = 'CLOSE_MENU_CHANGE';

export function closeMenuChange() {
  return {
    type: CLOSE_MENU_CHANGE,
  };
}

export const DELETE_STATUS = 'DELETE_STATUS';

export function deleteMenuStatus() {
  return {
    type: DELETE_STATUS,
  };
}

export const GET_SINGLE_CATEGORY_MENU = define('GET_SINGLE_CATEGORY_MENU');

export function getSingleCategoryMenu(
  categoryId,
  restaurantId,
  restaurantBranchId,
  lang,
  page,
  name,
  bool,
) {
  return GET_SINGLE_CATEGORY_MENU.request(() => Api.getSingleCategoryMenu(
    categoryId,
    restaurantId,
    restaurantBranchId,
    lang,
    page,
  ))
    .onRequest((p) => {
      p.bool = bool;
      return p;
    })
    .onSuccess((p) => {
      p.name = name;
      p.page = page;
      return p;
    })
    .takeLatest();
}

export const GLOBAL_UPDATE_CHANGE = 'GLOBAL_UPDATE_CHANGE';

export function globalUpdateChange(id, price, index) {
  return {
    type: GLOBAL_UPDATE_CHANGE,
    payload: {
      id,
      price,
      index,
    },
  };
}

export const GLOBAL_UPDATE_SAVE = define('GLOBAL_UPDATE_SAVE');

export function globalUpdateSave(menus) {
  return GLOBAL_UPDATE_SAVE.request(() => Api.saveGlobalUpdate(menus))
    .takeLatest();
}

export const ADD_ITEM_TYPE = 'ADD_ITEM_TYPE';

export function addItemType() {
  return {
    type: ADD_ITEM_TYPE,
  };
}

export const TYPE_CHANGE_VALUE = 'TYPE_CHANGE_VALUE';

export function typeChangeValue(path, value, lang, index) {
  return {
    type: TYPE_CHANGE_VALUE,
    payload: {
      path,
      value,
      lang,
      index,
    },
  };
}
