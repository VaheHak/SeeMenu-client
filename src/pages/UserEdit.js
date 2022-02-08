import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Delete, ExitToApp, Person, Settings,
} from '@material-ui/icons';
import {
  Button, FormGroup, Snackbar, Switch, Tooltip,
} from '@material-ui/core';
import memoizeOne from 'memoize-one';
import _ from 'lodash';
import { Alert } from '@material-ui/lab';
import {
  changeFactor,
  changeUser,
  chooseUser,
  updateUser,
  deleteStatus,
  deleteUser,
} from '../store/actions/user';
import { deleteToken } from '../store/actions/login';
import Input from '../components/Inputs/Input';
import edit from '../assets/images/editUser.png';
import Password from '../components/Inputs/Password';
import DeleteCategoryModal from '../components/Modals/DeleteCategoryModal';

class UserEdit extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    chooseUser: PropTypes.func.isRequired,
    changeUser: PropTypes.func.isRequired,
    userData: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    changeFactor: PropTypes.func.isRequired,
    deleteToken: PropTypes.func.isRequired,
    userError: PropTypes.string.isRequired,
    updateUser: PropTypes.func.isRequired,
    deleteStatus: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    status: PropTypes.string.isRequired,
    errors: PropTypes.object.isRequired,
  };

  initUser = memoizeOne((user) => {
    if (_.isEmpty(user)) {
      return;
    }

    const { formData } = this.state;

    _.map(user, (value, path) => {
      _.set(formData, path, value);
    });

    this.setState({
      formData: { ...formData },
    });
  }, _.isEqual);

  constructor(props) {
    super(props);
    this.state = {
      error: '',
      formData: {},
      controlBlock: false,
      deleteModal: false,
    };
  }

  async componentDidMount() {
    const { token } = this.props;

    if (token) {
      await this.props.chooseUser();
    }
  }

  handleChange = (path, value) => {
    const { formData } = this.state;

    this.props.changeUser(path, value);

    _.set(formData, path, value);

    this.setState({
      formData: { ...formData },
    });
  };

  handleBlur = () => {
    const { userData } = this.props;

    if (userData.password !== userData.repeatPassword) {
      this.setState({
        error: 'Wrong repeat password!',
      });
    } else {
      this.setState({
        error: '',
      });
    }
  };

  toggleFactorChange = async () => {
    const {
      formData,
    } = this.state;

    await this.props.changeFactor(formData.email, !formData.two_factor_auth);
    await this.props.chooseUser();
  };

  controlBlock = () => {
    const { controlBlock } = this.state;

    this.setState({
      controlBlock: !controlBlock,
    });
  };

  controlBlockClose = (ev) => {
    if (ev.target.classList.contains('closeControl')) {
      this.controlBlock();
    }
  };

  logOut = () => {
    this.props.deleteToken();
  };

  saveUpdates = async () => {
    const { userData } = this.props;

    if (userData.password !== userData.repeatPassword) {
      this.setState({
        error: 'Wrong repeat password!',
      });
    } else {
      const { payload: { data: { errors } } } = await this.props.updateUser(userData);

      if (!errors) {
        await this.props.chooseUser();
      }

      this.setState({
        error: '',
      });
    }
  };

  closeDeleteModal = () => {
    this.setState({
      deleteModal: false,
    });
  };

  deleteAccount = async () => {
    const { formData } = this.state;

    await this.props.deleteUser(formData.id);
    this.props.deleteToken();
  };

  render() {
    const {
      token,
      userData,
      userError,
      errors,
      status,
    } = this.props;

    const {
      error,
      controlBlock,
      formData,
      deleteModal,
    } = this.state;

    if (!token) {
      return <Redirect to="/login" />;
    }

    this.initUser(userData, userData.two_factor_auth);

    return (
      <div className="editUser">
        {userError
          ? alert(userError)
          : null}
        <div className="person">
          <p>My profile</p>
          <nav className="profileControlBlock">
            <Person className="personIcon" onClick={this.controlBlock} />
            {controlBlock ? (
              <div className="closeControl" onClick={this.controlBlockClose}>
                <ul className="controlBlock">
                  <li>
                    <Link to={`/user/${formData.id}/edit`}>
                      <Settings className="controlIcon" />
                      <span>My account</span>
                    </Link>
                  </li>
                  <li onClick={this.logOut}>
                    <ExitToApp className="controlIcon" />
                    <span>Log out</span>
                  </li>
                </ul>
              </div>
            ) : null}
          </nav>
        </div>
        <div className="editBlock">
          <div className="inputsBlock">
            <form className="nameBlock">
              <div className="formBlock">
                <span className="inputLabel">Name</span>
                <Input
                  className="inputArea"
                  type="text"
                  helperText={errors?.firstName}
                  onChange={(ev) => this.handleChange('firstName', ev.target.value)}
                  value={formData.firstName}
                />
              </div>
              <div className="formBlock">
                <span className="inputLabel">Surname</span>
                <Input
                  className="inputArea"
                  type="text"
                  helperText={errors?.lastName}
                  onChange={(ev) => this.handleChange('lastName', ev.target.value)}
                  value={formData.lastName}
                />
              </div>
              <div className="formBlock">
                <span className="inputLabel">Phone</span>
                <Input
                  className="inputArea"
                  type="text"
                  helperText={errors?.phone}
                  onChange={(ev) => this.handleChange('phone', ev.target.value)}
                  value={formData.phone}
                />
              </div>
              <div className="formBlock">
                <span className="inputLabel">Email</span>
                <Input
                  className="inputArea"
                  type="text"
                  disabled
                  helperText={errors?.email}
                  onChange={(ev) => this.handleChange('email', ev.target.value)}
                  value={formData.email}
                />
              </div>
            </form>
            <form className="nameBlock">
              <div className="formBlock">
                <span className="inputLabel">Password</span>
                <Password
                  className="inputArea"
                  error={errors?.oldPassword}
                  onChange={(ev) => this.handleChange('oldPassword', ev.target.value)}
                  value={formData.oldPassword}
                />
              </div>
              <div className="formBlock">
                <span className="inputLabel">New password</span>
                <Password
                  className="inputArea"
                  error={errors?.password}
                  onChange={(ev) => this.handleChange('password', ev.target.value)}
                  value={formData.password}
                />
              </div>
              <div className="formBlock">
                <span className="inputLabel">Confirm password</span>
                <Password
                  className="inputArea"
                  error={error}
                  onChange={(ev) => this.handleChange('repeatPassword', ev.target.value)}
                  onBlur={this.handleBlur}
                  value={formData.repeatPassword}
                />
              </div>
            </form>
          </div>
          <img src={edit} alt="edit" />
        </div>
        <div className="twoFactor">
          <div className="switchBlock">
            <FormGroup>
              <Switch
                size="medium"
                checked={formData.two_factor_auth ? formData.two_factor_auth : false}
                onChange={this.toggleFactorChange}
              />
            </FormGroup>
            <h2>Enable Two factor authentication</h2>
          </div>
          <p>
            Two factor authentication (2FA) adds another layer of security to your account.
            When enabled, you are required to login both with your password and a
            one-time verification code from your email.
          </p>
        </div>
        <div className="buttonsBlock">
          <Tooltip
            title="Delete My Account"
            arrow
            onClick={() => this.setState({
              deleteModal: true,
            })}
          >
            <Button>
              <Delete className="delete" />
            </Button>
          </Tooltip>
          <div className="saveBlock">
            <button
              type="button"
              onClick={() => this.props.history.goBack()}
              className="back"
            >
              Cancel
            </button>
            <button
              type="button"
              className="back save"
              onClick={this.saveUpdates}
            >
              Save
            </button>
          </div>
        </div>
        {status ? (
          <Snackbar
            className="errorBar"
            open={!_.isEmpty(status)}
            autoHideDuration={2000}
            onClose={this.props.deleteStatus}
          >
            <Alert onClose={this.props.deleteStatus} severity="success">
              {status}
            </Alert>
          </Snackbar>
        ) : null}
        {deleteModal
          ? (
            <DeleteCategoryModal
              text="Are you sure you want to delete your account?"
              close={this.closeDeleteModal}
              deleteCategory={this.deleteAccount}
            />
          ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.login.token,
  userData: state.user.userData,
  userError: state.user.userError,
  errors: state.user.errors,
  status: state.user.status
  ,
}

);

const mapDispatchToProps = {
  chooseUser,
  changeUser,
  changeFactor,
  deleteToken,
  updateUser,
  deleteStatus,
  deleteUser,
};
const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserEdit);

export default withRouter(Container);
