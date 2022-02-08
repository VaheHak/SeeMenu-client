import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { CheckCircleOutline } from '@material-ui/icons';
import { CircularProgress } from '@material-ui/core';
import WrapperLogOut from '../components/WrapperLogOut';
import Input from '../components/Inputs/Input';
import {
  registerChange, registerUser, closeModal, userForgotPassword,
} from '../store/actions/register';
import Password from '../components/Inputs/Password';

class Register extends Component {
  static propTypes = {
    registerUser: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    userForgotPassword: PropTypes.func.isRequired,
    registerChange: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    loadingForgot: PropTypes.bool.isRequired,
    forgotModalText: PropTypes.bool.isRequired,
    loadingRegister: PropTypes.bool.isRequired,
    successModal: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      modalForgotIsOpen: false,
      error: '',
    };
  }

  handleChange = (path, value) => {
    this.props.registerChange(path, value);
  };

  handleSubmit = async (ev) => {
    ev.preventDefault();

    const { formData } = this.props;

    if (formData.repeat === formData.password) {
      await this.props.registerUser(formData);
    } else {
      this.setState({
        error: 'Wrong repeat password!',
      });
    }
  };

  handleBlur = (ev) => {
    const { formData } = this.props;
    if (formData.password === ev.target.value) {
      this.setState({
        error: '',
      });
    } else {
      this.setState({
        error: 'Wrong repeat password!',
      });
    }
  };

  openModalForgot = () => this.setState({ modalForgotIsOpen: true });

  closeModalForgot = async () => {
    await this.props.closeModal();

    this.setState({ modalForgotIsOpen: false });
  };

  forgotSubmit = async (ev) => {
    ev.preventDefault();

    const { formData } = this.props;

    await this.props.userForgotPassword(formData);
  };

  render() {
    const {
      error,
      modalForgotIsOpen,
    } = this.state;

    const {
      formData,
      errors,
      successModal,
      loadingRegister,
      forgotModalText,
      loadingForgot,
    } = this.props;

    return (
      <WrapperLogOut>
        <div className="registration">
          <div className="regBlock">
            <form onSubmit={this.handleSubmit} className="formRegistration">
              <h3 className="signUp">FREE SIGN UP</h3>
              <Input
                className="inputArea"
                label="Name"
                type="text"
                value={formData.firstName}
                helperText={errors?.firstName}
                onChange={(ev) => this.handleChange('firstName', ev.target.value)}
              />
              <Input
                className="inputArea"
                label="Surname"
                type="text"
                helperText={errors?.lastName}
                onChange={(ev) => this.handleChange('lastName', ev.target.value)}
                value={formData.lastName}
              />
              <Input
                className="inputArea"
                label="Email"
                type="text"
                helperText={errors?.email}
                onChange={(ev) => this.handleChange('email', ev.target.value)}
                value={formData.email}
              />
              <Input
                className="inputArea"
                label="Phone"
                type="tel"
                helperText={errors?.phone}
                onChange={(ev) => this.handleChange('phone', ev.target.value)}
                value={formData.phone}
              />
              <Password
                label="Password"
                onChange={(ev) => this.handleChange('password', ev.target.value)}
                error={errors?.password}
                width={75}
              />
              <Password
                label="Confirm password"
                onChange={(ev) => this.handleChange('repeat', ev.target.value)}
                error={error}
                onBlur={this.handleBlur}
                width={135}
              />
              <button className="registerBut" type="submit">
                {loadingRegister
                  ? (
                    <div className="loadingBLock">
                      <div className="loading">
                        <CircularProgress className="load" size={18} />
                      </div>
                    </div>
                  )
                  : (
                    <span>
                      Register
                    </span>
                  )}
              </button>
            </form>
          </div>
          <hr />
          <div className="forgetBlock">
            <Link to="/login">
              <button type="button" className="forgetButton forgetLogin">LOGIN</button>
            </Link>
            <button className="forgetButton" type="button" onClick={this.openModalForgot}>
              FORGOT
            </button>
          </div>
          {successModal ? (
            <Modal
              overlayClassName="successModal"
              isOpen
              onRequestClose={this.props.closeModal}
            >
              <div className="regSuccessBlock">
                <div className="successImage">
                  <CheckCircleOutline style={{
                    fontSize: 100,
                    color: 'green',
                    margin: '0 auto',
                    display: 'flex',
                  }}
                  />
                  <span className="successText">Registration completed successfully</span>
                </div>
                <div className="verification">
                  <span
                    className="verifyText"
                  >
                    A verification link has been sent to your email account.
                  </span>
                  <br />
                  <span className="verifyText">Please, verify your email address for sign in!</span>
                  <Link to="/login">
                    <button type="button" className="close" onClick={this.props.closeModal}>
                      Close
                    </button>
                  </Link>
                </div>
              </div>
            </Modal>
          )
            : null}
          <Modal
            overlayClassName="forgotModal"
            isOpen={modalForgotIsOpen}
            onRequestClose={this.closeModalForgot}
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
                        helperText={errors?.email}
                        onChange={(ev) => this.handleChange('email', ev.target.value)}
                        value={formData.email}
                      />
                      <div className="buttonsBlock">
                        <button
                          type="button"
                          className="loginBut"
                          onClick={this.closeModalForgot}
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
                    <Link to="/login">
                      <button
                        type="button"
                        className="close Forgot"
                        onClick={this.closeModalForgot}
                      >
                        Close
                      </button>
                    </Link>
                  </div>
                )}
            </div>
          </Modal>
        </div>
      </WrapperLogOut>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.register.errors,
  formData: state.register.formData,
  loadingRegister: state.register.loading_register,
  successModal: state.register.successModal,
  forgotModalText: state.register.forgotModalText,
  loadingForgot: state.register.loading_forgot,
});

const mapDispatchToProps = {
  registerUser,
  userForgotPassword,
  registerChange,
  closeModal,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Register);

export default Container;
