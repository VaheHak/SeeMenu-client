import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Remove, Add } from '@material-ui/icons';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { changeCount } from '../store/actions/qr';

class SingleOrder extends Component {
  static propTypes = {
    changeCount: PropTypes.func.isRequired,
    item: PropTypes.any,
    order: PropTypes.object.isRequired,
    control: PropTypes.bool.isRequired,
    tableName: PropTypes.any.isRequired,
    roleStat: PropTypes.bool.isRequired,
    tableOrder: PropTypes.object.isRequired,
  };

  static defaultProps = {
    item: {},
    tableOrder: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  componentDidMount() {
    const {
      item,
      order,
      roleStat,
    } = this.props;

    if (!_.isEmpty(order)) {
      _.find(order, (i, name) => {
        if (item.number === name) {
          this.setState({
            count: i[name],
          });
        }
      });
    } else if (roleStat && _.isEmpty(order)) {
      this.setState({
        count: 0,
      });
    } else {
      this.setState({
        count: Object.values(item)[0],
      });
    }
  }

  handleClick = (name, bool) => {
    let { count } = this.state;
    const { item } = this.props;
    if (bool) {
      if (count < 20) {
        this.props.changeCount(name, count + 1, '+', item.link);
        count += 1;
        this.setState({
          count,
        });
      }
    } else if (count > 0) {
      this.props.changeCount(name, count - 1, '-', item.link);
      count -= 1;
      this.setState({
        count,
      });
    }
  };

  handleChange = (ev) => {
    if (+ev.target.value <= 20 && +ev.target.value >= 0) {
      const { item } = this.props;

      this.props.changeCount(ev.target.name, +ev.target.value, '*', item.link);
      this.setState({
        count: +ev.target.value,
      });
    }
  };

  render() {
    const {
      item,
      control,
      tableName,
    } = this.props;
    const { count } = this.state;
    return (
      <div className="singleTable">
        <p className="tableName">{item?.id ? item.number : tableName}</p>
        <div className="countControl">
          {control ? (
            <Button onClick={() => this.handleClick(item?.id ? item.number : tableName, 0)}>
              <Remove />
            </Button>
          ) : null}
          <input
            disabled={!control}
            className="count"
            type="number"
            name={!_.isFinite(item) ? item.number : tableName}
            onChange={this.handleChange}
            value={count || 0}
          />
          {control ? (
            <Button onClick={() => this.handleClick(item?.id ? item.number : +tableName, 1)}>
              <Add />
            </Button>
          ) : null}
        </div>
      </div>
    );
  }
}

const
  mapStateToProps = (state) => ({
    order: state.qr.order,
    table: state.table,
  });

const
  mapDispatchToProps = {
    changeCount,
  };

const
  Container = connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SingleOrder);

export default withRouter(Container);
