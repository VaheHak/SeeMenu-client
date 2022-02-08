import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { userRepeatPassword, deleteToken, deleteStatus } from '../store/actions/login';
import Logo from '../assets/images/see_menu_orange.png';
import Password from '../components/Inputs/Password';

class Forgot extends Component {
  static propTypes = {
    userRepeatPassword: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    deleteToken: PropTypes.func.isRequired,
    deleteStatus: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      errors: {},
      modalIsOpen: false,
      success: false,
    };
  }

  componentDidMount() {
    this.props.deleteToken();
  }

  handleChange = (path, value) => {
    const {
      formData,
      errors,
    } = this.state;
    _.set(formData, path, value);
    delete errors[path];
    this.setState({
      formData,
      errors,
    });
  };

  handleSubmit = async (ev) => {
    ev.preventDefault();
    const {
      formData,
      errors,
    } = this.state;
    _.set(formData, 'activationCode', this.props.match.params.key);

    if (formData.repeat === formData.password) {
      const { payload: { data } } = await this.props.userRepeatPassword(formData);

      if (data.status === 'Your password has changed') {
        this.openModal();
        this.setState({
          success: true,
        });
      } else if (data.errors.user) {
        this.openModal();
        this.setState({
          errors: data.errors || {},
        });
      } else {
        this.setState({
          errors: data.errors || {},
        });
      }
    } else {
      errors.repeat = 'Wrong repeat password!';
      this.setState({
        errors,
      });
    }
  };

  handleBlur = (ev) => {
    const {
      formData,
      errors,
    } = this.state;
    if (formData.password === ev.target.value) {
      delete errors.repeat;
      this.setState({
        errors,
      });
    } else {
      errors.repeat = 'Wrong repeat password!';
      this.setState({
        errors,
      });
    }
  };

  closeModal = () => this.setState({ modalIsOpen: false });

  openModal = () => this.setState({ modalIsOpen: true });

  render() {
    const {
      formData,
      errors,
      modalIsOpen,
      success,
    } = this.state;

    return (
      <div className="repeat">
        <div className="logoBlock">
          <img src={Logo} alt="logo" />
        </div>
        <div className="successText">
          <h2 className="doneText">
            You are almost done!
          </h2>
          <p className="passwordText">
            Set your password to access the SeeMenu platform.
          </p>
        </div>
        <form className="repeatPasswordForm" onSubmit={this.handleSubmit}>
          <Password
            label="Password"
            onChange={(ev) => this.handleChange('password', ev.target.value)}
            error={errors?.password}
            value={formData.password}
            width={75}
          />
          <Password
            label="Confirm password"
            onChange={(ev) => this.handleChange('repeat', ev.target.value)}
            error={errors?.repeat}
            onBlur={this.handleBlur}
            value={formData.repeat}
            width={135}
          />
          <button className="registerBut" type="submit">Set password</button>
        </form>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={this.closeModal}
          overlayClassName="repeatModal"
        >
          <div className="repeatBLock">
            {success
              ? (
                <div className="successRepeatBlock">
                  <span className="successText">
                    Your password has been changed.
                  </span>
                  <Link to="/login">
                    <button type="button" className="close Forgot" onClick={this.closeModal}>
                      Close
                    </button>
                  </Link>
                </div>
              )
              : (
                <div className="errorRepeatBlock">
                  <span className="errorText">
                    {errors.user}
                  </span>
                </div>
              )}
          </div>
        </Modal>
        {errors.status
          ? (
            <Snackbar
              className="errorBar"
              open={!_.isEmpty(errors.status)}
              autoHideDuration={2000}
              onClose={this.props.deleteStatus}
            >
              <Alert onClose={this.props.deleteStatus} severity="error">
                Sorry you are deactivated!
              </Alert>
            </Snackbar>
          ) : null}
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  userRepeatPassword,
  deleteToken,
  deleteStatus,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Forgot);

export default Container;
