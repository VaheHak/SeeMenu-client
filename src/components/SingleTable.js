import React, { Component } from 'react';
import { Edit, Delete } from '@material-ui/icons';
import PropTypes from 'prop-types';

class SingleTable extends Component {
  static propTypes = {
    del: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    table: PropTypes.object.isRequired,
  };

  render() {
    const {
      table,
      edit,
      del,
    } = this.props;

    return (
      <div className="table">
        <span className="tableNumber">{table.number}</span>
        <div className="tableControlBlock">
          <Edit className="edit" onClick={() => edit(table.id)} />
          <Delete className="delete" onClick={() => del(table.id)} />
        </div>
      </div>
    );
  }
}

export default SingleTable;
