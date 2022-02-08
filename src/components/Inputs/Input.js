import React, { Component } from 'react';
import { TextField } from '@material-ui/core/';
import PropTypes from 'prop-types';
import _ from 'lodash';

class Input extends Component {
    static propTypes = {
      label: PropTypes.string,
      type: PropTypes.string.isRequired,
      id: PropTypes.string,
      helperText: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }

    static defaultProps = {
      helperText: undefined,
      label: undefined,
      value: '',
      id: undefined,
    }

    constructor(props) {
      super(props);
      this.id = _.uniqueId('input_');
    }

    render() {
      const { helperText, id, ...props } = this.props;

      return (
        <div className="inputBlock">
          <TextField
            size="small"
            error={!!helperText}
            helperText={helperText}
            variant="outlined"
            id={id || this.id}
            {...props}
          />
        </div>
      );
    }
}

export default Input;
