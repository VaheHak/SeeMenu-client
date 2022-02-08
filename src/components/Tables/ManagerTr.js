import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Delete, Edit } from '@material-ui/icons';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import DeleteCategoryModal from '../Modals/DeleteCategoryModal';
import { getManagers } from '../../store/actions/manager';

class ManagerTr extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    manager: PropTypes.object.isRequired,
    edit: PropTypes.func.isRequired,
    deleted: PropTypes.func.isRequired,
    getManagers: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      deleteBoolManager: false,
    };
  }

  openDeleteManager = () => {
    this.setState({
      deleteBoolManager: true,
    });
  };

  closeDeleteManager = async () => {
    await this.props.getManagers();

    this.setState({
      deleteBoolManager: false,
    });
  };

  render() {
    const {
      index,
      manager,
      edit,
      deleted,
    } = this.props;

    const { deleteBoolManager } = this.state;

    return (
      <tr>
        <td>{index + 1}</td>
        <td>{manager.firstName}</td>
        <td>{manager.lastName}</td>
        <td className="emailBlock">
          <span>
            {_.truncate(manager.email, {
              length: 30,
              separator: '...',
            })}
          </span>
          <span className="emailVisibility">{manager.email}</span>
        </td>
        <td>{manager.phone}</td>
        <td className="emailBlock">
          <span>
            {_.truncate(manager.managerRest[0]?.name, {
              length: 30,
              separator: '...',
            })}
          </span>
          <span className="emailVisibility">{manager.managerRest[0]?.name}</span>
        </td>
        <td className="emailBlock">
          <span>
            {_.truncate(manager.managerRest[0]?.address, {
              length: 30,
              separator: '...',
            })}
          </span>
          <span className="emailVisibility">{manager.managerRest[0]?.address}</span>
        </td>
        <td>
          {moment(manager.createdAt)
            .format('DD MMMM YYYY  hh:mm:ss')}
        </td>
        <td>
          <div className="buttonsBlock">
            <Edit className="edit" onClick={() => edit(manager.id)} />
            <Delete className="delete" onClick={this.openDeleteManager} />
          </div>
        </td>
        {deleteBoolManager
          ? (
            <DeleteCategoryModal
              text="Are you sure you want to delete this manager?"
              deleteCategory={() => deleted(manager.id)}
              close={this.closeDeleteManager}
            />
          )
          : null}
      </tr>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  getManagers,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManagerTr);

export default withRouter(Container);
