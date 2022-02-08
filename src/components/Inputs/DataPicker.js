import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';

class DataPicker extends Component {
  static propTypes = {
    change: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
    date: PropTypes.any.isRequired,
  };

  render() {
    const {
      change,
      date,
      clear,
    } = this.props;

    return (
      <DatePicker
        value={moment(date)
          .format('DD MMM YYYY')}
        selected={moment(date, 'DD MMM YYYY')
          .toDate()}
        onChange={(ev) => change(ev)}
      >
        <span className="clearButton" onClick={clear}>Clear</span>
      </DatePicker>
    );
  }
}

export default DataPicker;
