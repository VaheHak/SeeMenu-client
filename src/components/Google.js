import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GoogleLogin } from 'react-google-login';
import { logDOM } from '@testing-library/react';
import { oAuthRequest } from '../store/actions/login';

class Google extends Component {
  static propTypes = {
    oAuthRequest: PropTypes.func.isRequired,
  };

  responseGoogle = () => async (response) => {
    try {
      await this.props.oAuthRequest('google', response.accessToken);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <>
        <GoogleLogin
          clientId="654098226760-3nmk3hbnjnlr5jfonbdr0kiam3q4lmql.apps.googleusercontent.com"
          buttonText=""
          className="my-google-button-class"
          onSuccess={this.responseGoogle()}
          onFailure={this.responseGoogle()}
          cookiePolicy="single_host_origin"
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
)(Google);
export default Container;
