import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { CircularProgress, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Close } from '@material-ui/icons';
import Input from '../components/Inputs/Input';
import WrapperLogOut from '../components/WrapperLogOut';
import {
  userForgotPassword,
} from '../store/actions/register';
import {
  loginChange,
  loginUser,
  sendStatus,
  deleteError,
  sendMessage,
  closeModal,
  deleteUniqKey,
} from '../store/actions/login';
import Password from '../components/Inputs/Password';
import Facebook from '../components/Facebook';
import Google from '../components/Google';
import Authentication from '../components/Modals/Authentication';

class Login extends Component {
  static propTypes = {
    formData: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    userForgotPassword: PropTypes.func.isRequired,
    loginChange: PropTypes.func.isRequired,
    deleteError: PropTypes.func.isRequired,
    sendMessage: PropTypes.func.isRequired,
    sendStatus: PropTypes.func.isRequired,
    loadingLogin: PropTypes.bool.isRequired,
    errors: PropTypes.object.isRequired,
    errorStatus: PropTypes.string.isRequired,
    sendMessageStatus: PropTypes.string.isRequired,
    loadingForgot: PropTypes.bool.isRequired,
    forgotModalText: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    uniqKey: PropTypes.string.isRequired,
    limited: PropTypes.string.isRequired,
    deleteUniqKey: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
    };
  }

  handleChange = (path, value) => {
    this.props.loginChange(path, value);
  };

  handleSubmit = async (ev) => {
    ev.preventDefault();

    const { formData } = this.props;

    await this.props.loginUser(formData);
  };

  openModal = () => {
    this.props.closeModal();
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => this.setState({ modalIsOpen: false });

  forgotSubmit = async (ev) => {
    ev.preventDefault();

    const { formData } = this.props;

    await this.props.userForgotPassword(formData);
  };

  sendMessage = async () => {
    const { formData } = this.props;

    await this.props.deleteError();

    await this.props.sendMessage(formData.email);
  };

  closeAuthenticationModal = () => {
    this.props.deleteUniqKey();
  };

  render() {
    const {
      modalIsOpen,
    } = this.state;

    const {
      formData,
      errors,
      errorStatus,
      sendMessageStatus,
      loadingLogin,
      loadingForgot,
      forgotModalText,
      uniqKey,
      limited,
    } = this.props;

    return (
      <WrapperLogOut>
        <div className="login">
          <div className="logBlock">
            <form className="formLogin" onSubmit={this.handleSubmit}>
              <h3 className="signIn">SIGN IN</h3>
              <Input
                className="inputArea"
                label="Email"
                type="text"
                onChange={(ev) => this.handleChange('email', ev.target.value)}
                value={formData.email}
              />
              <Password
                label="Password"
                onChange={(ev) => this.handleChange('password', ev.target.value)}
                width={75}
              />
              <button className="loginBut" type="submit">
                {loadingLogin
                  ? (
                    <div className="loadingBLock">
                      <div className="loading">
                        <CircularProgress className="load" size={25} />
                      </div>
                    </div>
                  )
                  : (
                    <span>
                      SIGN IN
                    </span>
                  )}
              </button>
            </form>
          </div>
          <hr />
          <button type="button" className="forgetButton" onClick={this.openModal}>
            Forgot password?
          </button>
          <div className="forgetBlock">
            <span>Don't have an account?</span>
            <Link to="/register">
              <button type="button" className="registerBut">Sign up</button>
            </Link>
          </div>
          <div className="oauthBlock">
            <Facebook />
            <Google />
          </div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={this.closeModal}
            overlayClassName="forgotModal"
          >
            <div className="forgotBlock">
              {forgotModalText
                ? (
                  <div className="writeBlock">
                    <h2>Please write your email.</h2>
                    <form onSubmit={this.forgotSubmit} className="forgotEmailFor">
                      <Input
                        className="inputArea"
                        label="Email"
                        type="text"
                        onChange={(ev) => this.handleChange('email', ev.target.value)}
                        value={formData.email}
                      />
                      <div className="buttonsBlock">
                        <button
                          type="button"
                          className="loginBut"
                          onClick={this.closeModal}
                        >
                          Close
                        </button>
                        <button type="submit" className="loginBut">
                          {loadingForgot
                            ? (
                              <div className="loadingBLock">
                                <div className="loading">
                                  <CircularProgress className="load" size={30} />
                                </div>
                              </div>
                            )
                            : <span>Send</span>}
                        </button>
                      </div>
                    </form>
                  </div>
                )
                : (
                  <div className="successForgotBlock">
                    <span className="successText">
                      Thanks, we sent message to your email.
                      <br />
                      Please check your email!
                    </span>
                    <button type="button" className="close Forgot" onClick={this.closeModal}>
                      Close
                    </button>
                  </div>
                )}
            </div>
          </Modal>
          {errorStatus
            ? (
              <Modal
                isOpen
                onRequestClose={this.props.deleteError}
                overlayClassName="repeatLogin"
              >
                <div className="messageBlock">
                  <div className="closeBlock">
                    <div className="closeButton">
                      <Close onClick={this.props.deleteError} />
                    </div>
                  </div>
                  <h2 className="verifyTitle">Please Verify Your Email Address</h2>
                  <p className="text">
                    You will need to verify your email address before you can continue the setup
                    process.
                  </p>
                  <button
                    className="sendButton"
                    onClick={this.sendMessage}
                    type="button"
                  >
                    Resend Verification Email
                  </button>
                </div>
              </Modal>
            )
            : null}
        </div>
        {errors
          ? (
            <Snackbar
              className="errorBar"
              open={!_.isEmpty(errors)}
              autoHideDuration={2000}
              onClose={this.props.deleteError}
            >
              <Alert onClose={this.props.deleteError} severity="error">
                {errors.password || errors.email || errors.status || errors.digit}
              </Alert>
            </Snackbar>
          ) : null}
        {sendMessageStatus
          ? (
            <Snackbar
              className="errorBar"
              open={!_.isEmpty(sendMessageStatus)}
              autoHideDuration={2000}
              onClose={this.props.sendStatus}
            >
              <Alert onClose={this.props.sendStatus} severity="success">
                {sendMessageStatus}
              </Alert>
            </Snackbar>
          ) : null}
        {uniqKey
          ? (
            <Authentication
              close={this.closeAuthenticationModal}
              uniqKey={uniqKey}
            />
          )
          : null}
        {limited
          ? (
            <Snackbar
              className="errorBar"
              open={!_.isEmpty(limited)}
              autoHideDuration={2000}
              onClose={this.props.deleteError}
            >
              <Alert onClose={this.props.deleteError} severity="error">
                {limited}
              </Alert>
            </Snackbar>
          ) : null}
      </WrapperLogOut>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.login.errors,
  formData: state.login.formData || {},
  errorStatus: state.login.error_status,
  sendMessageStatus: state.login.send_status,
  loadingLogin: state.login.loading_login,
  loadingForgot: state.login.loading_forgot,
  forgotModalText: state.login.forgotModalText,
  uniqKey: state.login.uniq_key,
  limited: state.login.limited,
});

const mapDispatchToProps = {
  loginUser,
  userForgotPassword,
  loginChange,
  deleteError,
  sendStatus,
  sendMessage,
  closeModal,
  deleteUniqKey,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

export default Container;
