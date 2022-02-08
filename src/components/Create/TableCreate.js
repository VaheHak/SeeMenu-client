import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import memoizeOne from 'memoize-one';
import {
  createTable,
  createTableChange,
  updateTable,
} from '../../store/actions/table';
import Input from '../Inputs/Input';

class TableCreate extends Component {
  static propTypes = {
    createTableChange: PropTypes.func.isRequired,
    createTable: PropTypes.func.isRequired,
    updateTable: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    singleTable: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    tableData: PropTypes.object.isRequired,
    button: PropTypes.string.isRequired,
    restaurantData: PropTypes.object.isRequired,
  }

  initTable = memoizeOne((table) => {
    if (!_.isEmpty(table)) {
      this.props.createTableChange('number', table.number);
      this.props.createTableChange('link', table.link);
      this.props.createTableChange('restaurantId', table.restaurantId);
      this.props.createTableChange('id', table.id);
    }
  }, _.isEqual)

  tableSave = async (ev) => {
    ev.preventDefault();
    const {
      button,
      restaurantData,
    } = this.props;

    if (button === 'Save') {
      await this.props.createTableChange('restaurantId', restaurantData.id);
      await this.props.createTableChange('link', `${restaurantData.link}/${restaurantData.id}`);
      await this.props.createTableChange('position', {
        positionX: 10,
        positionY: 10,
        width: 100,
        height: 100,
      });

      const { tableData } = this.props;
      const { payload: { data: { errors } } } = await this.props.createTable(tableData);

      if (!errors) {
        this.props.close();
      }
    }
    if (button === 'Edit') {
      const { tableData } = this.props;

      const { payload: { data: { errors } } } = await this.props.updateTable(tableData);

      if (!errors) {
        this.props.close();
      }
    }
  }

  tableChange = (path, value) => {
    this.props.createTableChange(path, value);
  }

  render() {
    const {
      errors,
      tableData,
      button,
      singleTable,
    } = this.props;

    this.initTable(singleTable);

    return (
      <>
        <form onSubmit={this.tableSave} className="tableForm">
          <Input
            className="inputArea"
            label="Table Name"
            type="text"
            helperText={errors?.number}
            onChange={(ev) => this.tableChange('number', ev.target.value)}
            value={tableData?.number || ''}
          />
          <button type="submit">{button}</button>
        </form>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.table.errors,
  tableData: state.table.tableData,
  restaurantData: state.restaurant.restaurantData,
  singleTable: state.table.single_table,
});

const mapDispatchToProps = {
  createTableChange,
  createTable,
  updateTable,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TableCreate);

export default withRouter(Container);
