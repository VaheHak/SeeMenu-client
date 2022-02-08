import React, { Component } from 'react';
import _ from 'lodash';
import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types';

class Textarea extends Component {
    static propTypes = {
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      id: PropTypes.string,
      helperText: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }

    static defaultProps = {
      helperText: undefined,
      value: '',
      id: undefined,
    }

    constructor(props) {
      super(props);
      this.id = _.uniqueId('area_');
    }

    render() {
      const { helperText, id, ...props } = this.props;

      return (
        <div className="inputBlock">
          <TextField
            multiline
            rowsMax={4}
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

export default Textarea;
