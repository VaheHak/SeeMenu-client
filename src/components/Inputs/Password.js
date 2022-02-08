import React, { Component } from 'react';
import {
  FormControl, FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@material-ui/core';
import {
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';
import PropTypes from 'prop-types';

class Password extends Component {
  static propTypes = {
    label: PropTypes.string,
    width: PropTypes.number,
    error: PropTypes.string,
  };

  static defaultProps = {
    error: undefined,
    label: undefined,
    width: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      showText: true,
    };
  }

  handleClickShowPassword = () => {
    const { showText } = this.state;
    this.setState({
      showText: !showText,
    });
  };

  render() {
    const { showText } = this.state;

    const {
      width,
      error,
      label,
      ...props
    } = this.props;

    return (
      <div className="inputBlock">
        <FormControl
          className="inputArea"
          variant="outlined"
          error={!!error}
        >
          {label ? <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel> : null}
          <OutlinedInput
            type={showText ? 'password' : 'text'}
            {...props}
            endAdornment={(
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={this.handleClickShowPassword}
                  edge="end"
                >
                  {showText ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )}
            labelWidth={width}
          />
          {error ? <FormHelperText>{error}</FormHelperText> : null}
        </FormControl>
      </div>
    );
  }
}

export default Password;
