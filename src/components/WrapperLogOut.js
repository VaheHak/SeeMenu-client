import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Cover from '../assets/images/sign_up.png';
import Logo from '../assets/images/see_menu_orange.png';

class WrapperLogOut extends Component {
  static propTypes = {
    className: PropTypes.string,
    token: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const {
      token,
      children,
      className,
    } = this.props;

    if (token) {
      return <Redirect to="/user/restaurants" />;
    }
    return (
      <div className={`wrapper ${className}`}>
        <div className="logoBlock">
          <img className="siteLogo" alt="logo" src={Logo} />
          <img className="siteCover" src={Cover} alt="Cover" />
        </div>
        <div className="container">
          {children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.login.token,
});
const mapDispatchToProps = {};
const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(WrapperLogOut);

export default Container;
