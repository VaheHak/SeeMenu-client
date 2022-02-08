import axios from 'axios';
import toFormData from 'object-to-formdata';
import Storage from './helpers/storage';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const c = config;
  const token = Storage.getToken();
  if (token) {
    c.headers.authorization = token;
  }
  return c;
}, Promise.reject);

class Api {
  static getOrdersAll(searchData) {
    return api.get('/orders/all', {
      params: {
        ...searchData,
      },
    });
  }

  static updateStatus(id, status) {
    return api.put('/restaurants/status', {
      id,
      status,
    });
  }

  static register(formData) {
    return api.post('/users/register', formData);
  }

  static login(formData) {
    return api.post('/users/login', formData);
  }

  static userProfile() {
    return api.get('/users');
  }

  static verification(formData) {
    return api.post('/users/user/confirm', formData);
  }

  static forgotPassword(formData) {
    return api.post('/users/reset/password', formData);
  }

  static repeatPassword(formData) {
    return api.put('users/confirm/email', formData);
  }

  static getRestaurants() {
    return api.get('/restaurants/main/restaurant');
  }

  static getBranches(id) {
    return api.get('/restaurants/branches/', {
      params: {
        id,
      },
    });
  }

  static getSingleRestaurant(id, lang) {
    return api.get('/restaurants/single/restaurant', {
      params: {
        id,
        lang,
      },
    });
  }

  static createRestaurant(formData) {
    return api.post('/restaurants', toFormData.serialize(formData, { indices: true }));
  }

  static deleteRestaurant(id) {
    return api.delete(`/restaurants/${id}`);
  }

  static updateRestaurant(formData) {
    return api.put('/restaurants', toFormData.serialize(formData, { indices: true }));
  }

  static createCategory(formData) {
    return api.post('/categories', toFormData.serialize(formData, { indices: true }));
  }

  static updateCategory(formData) {
    return api.put('/categories', toFormData.serialize(formData, { indices: true }));
  }

  static updateCategoryAvailable(formData) {
    return api.put('/categories/update/available', formData);
  }

  static getSingleCategory(id) {
    return api.get('/categories/single/category', {
      params: {
        id,
      },
    });
  }

  static getCategories(id, branchId, lang) {
    return api.get('/categories', {
      params: {
        restaurantId: id,
        restBranchId: branchId,
        lang,
      },
    });
  }

  static deleteCategory(id) {
    return api.delete(`/categories/${id}`);
  }

  static createMenu(formData) {
    return api.post('/menus', toFormData.serialize(formData, { indices: true }));
  }

  static deleteMenu(id) {
    return api.delete(`/menus/${id}`);
  }

  static updateMenu(formData) {
    return api.put('/menus', toFormData.serialize(formData, { indices: true }));
  }

  static updateSingleMenu(formData) {
    return api.put('/menus/update/menu/available', formData);
  }

  static getSingleMenu(sourceId, categoryId) {
    return api.get('/menus/single/menu/languages', {
      params: {
        sourceId,
        categoryId,
      },
    });
  }

  static getSingleCategoryMenu(categoryId, restaurantId, restaurantBranchId, lang, p) {
    return api.get('/menus/my/menus', {
      params: {
        restaurantId,
        restaurantBranchId,
        categoryId,
        lang,
        p,
      },
    });
  }

  static createTable(formData) {
    return api.post('/table', formData);
  }

  static getTables(restaurantId) {
    return api.get('/table', {
      params: {
        restaurantId,
      },
    });
  }

  static getSingleTable(id) {
    return api.get('/table/single/table', {
      params: {
        id,
      },
    });
  }

  static updateTable(formData) {
    return api.put('/table', formData);
  }

  static deleteTable(id) {
    return api.delete(`/table/${id}`);
  }

  static orderTemplate(tables, template, restaurantId, styles) {
    return api.post('/orders', {
      tables,
      template,
      restaurantId,
      styles,
    });
  }

  static updateOrderTemplate(id, styles, status) {
    return api.put('/orders', {
      id,
      styles,
      status,
    });
  }

  static getManagers(searchData = {}) {
    return api.get('/users/managers', {
      params: {
        ...searchData,
      },
    });
  }

  static createManager(managerData) {
    return api.post('/users/manager', managerData);
  }

  static deleteManager(id) {
    return api.delete(`/users/${id}`);
  }

  static getSingleManager(id) {
    return api.get('/users/single/manager', {
      params: {
        id,
      },
    });
  }

  static updateManager(managerData) {
    return api.put('/users/update', managerData);
  }

  static getOrders(restaurantId, searchData) {
    return api.get('/orders', {
      params: {
        restaurantId,
        ...searchData,
      },
    });
  }

  static deleteOrder(id) {
    return api.delete(`/orders/${id}`);
  }

  static sendMessage(email) {
    return api.post('/users/resend/email', { email });
  }

  static getBranchesWithoutManager(branchId) {
    return api.get('/restaurants/restaurant/without/manager', {
      params: {
        branchId,
      },
    });
  }

  static getUsersList(formData) {
    return api.get('/users/all', {
      params: {
        ...formData,
      },
    });
  }

  static updateUsersList(formData) {
    return api.put('/users/update', formData);
  }

  static updateUsersStatus(id, status) {
    return api.put('/users/update/status', {
      id,
      status,
    });
  }

  static deleteUsersList(id) {
    return api.delete(`/users/${id}`);
  }

  static getRestaurantListAll(s) {
    return api.get('/restaurants/all', {
      params: {
        s,
      },
    });
  }

  static saveGlobalUpdate(menus) {
    return api.put('menus/multiply/update', { menus });
  }

  static changeTwoFactor(data) {
    return api.put('/users/2factor/authentication', data);
  }

  static updateUser(data) {
    return api.put('/users/update', data);
  }

  static deleteUser(id) {
    return api.delete(`/users/${id}`);
  }

  static getOauthLogin(service, accessToken) {
    if (service === 'google') {
      return api.get('/oauth/google', {
        params: {
          accessToken,
        },
      });
    }

    return api.get('/oauth/facebook', {
      params: {
        accessToken,
      },
    });
  }

  static twoFactorAuthentication(formData) {
    return api.post('/users/2factor/verify', formData);
  }

  static getAllBranches(id, s) {
    return api.get('/restaurants/all/branches', {
      params: {
        id,
        s,
      },
    });
  }

  static getOneRestaurant(id, lang) {
    return api.get('/restaurants/one/restaurant', {
      params: {
        id,
        lang,
      },
    });
  }

  static getSingleOrder(id) {
    return api.get('orders/single/order', {
      params: {
        id,
      },
    });
  }
}

export default Api;
