import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FacebookLogin from 'react-facebook-login';
import { oAuthRequest } from '../store/actions/login';

class Facebook extends Component {
  static propTypes = {
    oAuthRequest: PropTypes.func.isRequired,
  };

  responseFacebook = async (response) => {
    try {
      await this.props.oAuthRequest('facebook', response.accessToken);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <>
        <FacebookLogin
          appId="536804607331962"
          autoLoad
          textButton=""
          fields="name,email"
          cssClass="my-facebook-button-class"
          callback={() => this.responseFacebook}
          icon="fa-facebook"
        />
      </>
    );
  }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = {
  oAuthRequest,
};
const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Facebook);
export default Container;
