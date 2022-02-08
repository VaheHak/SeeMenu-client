import { define } from '../../helpers/redux-request';
import Api from '../../Api';

export const CREATE_CATEGORY = define('CREATE_CATEGORY');

export function createCategory(formData) {
  return CREATE_CATEGORY.request(() => Api.createCategory(formData)).takeLatest();
}

export const DELETE_CATEGORY = define('DELETE_CATEGORY');

export function deleteCategory(id, restaurantId) {
  return DELETE_CATEGORY.request(() => Api.deleteCategory(id, restaurantId)).takeLatest();
}

export const SINGLE_CATEGORY = define('SINGLE_CATEGORY');

export function getSingleCategory(id) {
  return SINGLE_CATEGORY.request(() => Api.getSingleCategory(id)).takeLatest();
}

export const UPDATE_CATEGORY = define('UPDATE_CATEGORY');

export function updateCategory(formData) {
  return UPDATE_CATEGORY.request(() => Api.updateCategory(formData)).takeLatest();
}

export const UPDATE_CATEGORY_AVAILABLE = define('UPDATE_CATEGORY_AVAILABLE');

export function updateCategoryAvailable(formData) {
  return UPDATE_CATEGORY_AVAILABLE.request(() => (
    Api.updateCategoryAvailable(formData))).takeLatest();
}

export const GET_CATEGORIES = define('GET_CATEGORIES');

export function getCategories(id, branchId, lang) {
  return GET_CATEGORIES.request(() => Api.getCategories(id, branchId, lang));
}

export const CREATE_CATEGORY_CHANGE = 'CREATE_CATEGORY_CHANGE';

export function createCategoryChange(path, value) {
  return {
    type: CREATE_CATEGORY_CHANGE,
    payload: { path, value },
  };
}

export const CLOSE_CATEGORY_CHANGE = 'CLOSE_CATEGORY_CHANGE';

export function closeCategoryChange() {
  return {
    type: CLOSE_CATEGORY_CHANGE,
  };
}

export const DELETE_CATEGORY_CHANGE_STATUS = 'DELETE_CATEGORY_CHANGE_STATUS';

export function deleteCategoryChangeStatus() {
  return {
    type: DELETE_CATEGORY_CHANGE_STATUS,
  };
}

export const DELETE_STATUS = 'DELETE_STATUS';

export function deleteStatus() {
  return {
    type: DELETE_STATUS,
  };
}
