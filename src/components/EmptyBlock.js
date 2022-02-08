import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EmptyBlock extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
  };

  render() {
    const { text } = this.props;

    return (
      <div className="emptyBlock">
        <div className="text">{text}</div>
      </div>
    );
  }
}

export default EmptyBlock;
