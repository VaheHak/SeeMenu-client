import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Group, Restaurant, Menu, SystemUpdateAlt,
} from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

class Management extends Component {
  static propTypes = {
    role: PropTypes.string.isRequired,
  };

  render() {
    const { role } = this.props;
    return (
      <div className="management">
        <ul>
          <NavLink to="/user/restaurants">
            <li>
              <Restaurant />
              <p className="disabled">Restaurant</p>
            </li>
          </NavLink>
          {role === 'superadmin' ? (
            <NavLink to="/user/users">
              <li>
                <Group />
                <p className="disabled">Users</p>
              </li>
            </NavLink>
          )
            : (
              <>
                {role === 'admin' ? (
                  <NavLink to="/user/managers">
                    <li>
                      <Group />
                      <p className="disabled">Managers</p>
                    </li>
                  </NavLink>
                ) : null}
              </>
            )}
          <NavLink to="/user/restaurant/menu">
            <li>
              <Menu />
              <p className="disabled">Menus</p>
            </li>
          </NavLink>
          {role !== 'superadmin' ? (
            <NavLink to="/user/restaurant/tables">
              <li>
                <FontAwesomeIcon icon={faQrcode} />
                <p className="disabled">Tables/Order QR</p>
              </li>
            </NavLink>
          ) : null}
          {role === 'superadmin' ? (
            <NavLink to="/user/restaurant/templates">
              <li>
                <SystemUpdateAlt />
                <p className="disabled">Download Templates</p>
              </li>
            </NavLink>
          ) : null}
          {/* {role === 'admin' ? ( */}
          {/*  <NavLink to="/user/restaurant/orderQr"> */}
          {/*    <li> */}
          {/*      <SystemUpdateAlt /> */}
          {/*      <p className="disabled">Order QR</p> */}
          {/*    </li> */}
          {/*  </NavLink> */}
          {/* ) : null} */}
        </ul>
      </div>
    );
  }
}

export default Management;
