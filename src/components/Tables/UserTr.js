import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { FormControlLabel, Switch } from '@material-ui/core';
import { connect } from 'react-redux';
import memoizeOne from 'memoize-one';
import { Delete, Edit } from '@material-ui/icons';
import {
  updateUsersStatus,
} from '../../store/actions/usersList';

class UserTr extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    user: PropTypes.object.isRequired,
    updateUsersStatus: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    deleted: PropTypes.func.isRequired,
  };

  userStatus = memoizeOne((result) => {
    this.setState({
      check: result.user_status,
    });
  }, _.isEqual);

  constructor(props) {
    super(props);
    this.state = {
      check: true,
    };
  }

  activeChange = async () => {
    const { check } = this.state;
    const { user } = this.props;

    user.user_status = !check;

    await this.props.updateUsersStatus(user.id, user.user_status);

    this.setState({
      check: !check,
    });
  };

  render() {
    const {
      index,
      user,
      edit,
      deleted,
    } = this.props;

    const { check } = this.state;

    this.userStatus(user);

    return (
      <tr>
        <td>{index + 1}</td>
        <td>{user.firstName}</td>
        <td>{user.lastName}</td>
        <td className="emailBlock">
          <span>
            {_.truncate(user.email, {
              length: 30,
              separator: '...',
            })}
          </span>
          <span className="emailVisibility">{user.email}</span>
        </td>
        <td className="emailBlock">
          <span>
            {_.truncate(user.phone, {
              length: 30,
              separator: '...',
            })}
          </span>
          <span className="emailVisibility">{user.phone}</span>
        </td>
        <td>{user.role}</td>
        <td>
          {moment(user.createdAt)
            .format('DD MMMM YYYY  hh:mm:ss')}
        </td>
        <td>
          <FormControlLabel
            label={user.user_status ? 'Active' : 'Deactive'}
            control={(
              <Switch
                checked={check}
                onChange={this.activeChange}
                color="primary"
              />
            )}
          />
        </td>
        <td>
          <div className="buttonsBlock">
            <Edit onClick={() => edit(user)} />
            <Delete className="delete" onClick={() => deleted(user.id)} />
          </div>
        </td>
      </tr>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  updateUsersStatus,
};
const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserTr);

export default Container;
