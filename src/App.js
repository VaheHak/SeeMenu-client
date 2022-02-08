import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Verify from './pages/Verify';
import Forgot from './pages/Forgot';
import Home from './pages/Home';
import RestaurantList from './pages/RestaurantList';
import RestaurantMenu from './components/RestaurantMenu';
import Menu from './pages/Menu';
import Branches from './components/Branches';
import Table from './pages/Tables';
import Templates from './pages/Templates';
import './assets/styles/index.scss';
import QrTables from './components/QRTables';
import Manager from './pages/Manager';
import Users from './pages/Users';
import OrderQrPage from './pages/OrderQrPage';
import Edit from './pages/UserEdit';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/user/verification/:key" component={Verify} />
          <Route path="/login" component={Login} />
          <Route path="/user/confirm/:key" component={Forgot} />
          <Route path="/user/restaurants/user/:userId" component={RestaurantList} />
          <Route path="/user/restaurants/:resId" component={Branches} />
          <Route path="/user/restaurants" component={RestaurantList} />
          <Route path="/user/restaurant/menu/:resId/:id" component={RestaurantMenu} />
          <Route path="/user/restaurant/menu/:resId/" component={Branches} />
          <Route path="/user/restaurant/menu" component={Menu} />
          <Route path="/user/restaurant/tables/:resId/:id/orderQr/" component={OrderQrPage} />
          <Route path="/user/restaurant/tables/:resId/:id" component={QrTables} />
          <Route path="/user/restaurant/tables/:resId" component={Branches} />
          <Route path="/user/restaurant/tables" component={Table} />
          <Route path="/user/restaurant/templates" component={Templates} />
          <Route path="/user/managers/" component={Manager} />
          <Route path="/user/users" component={Users} />
          <Route path="/" exact component={Home} />
          <Route path="/user/:id/edit" component={Edit} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
