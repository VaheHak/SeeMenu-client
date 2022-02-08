import { combineReducers } from 'redux';
import register from './register';
import login from './login';
import user from './user';
import category from './category';
import menu from './menu';
import restaurant from './restaurant';
import table from './table';
import orders from './orders';
import manager from './manager';
import qr from './qr';
import restaurantsList from './restaurantsList';
import usersList from './usersList';

export default combineReducers({
  register,
  login,
  user,
  category,
  menu,
  restaurant,
  table,
  orders,
  manager,
  qr,
  restaurantsList,
  usersList,
});
