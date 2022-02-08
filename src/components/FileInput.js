import React, { Component } from 'react';
import memoizeOne from 'memoize-one';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Default from '../assets/images/default.png';

class FileInput extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    file: PropTypes.any,
  };

  static defaultProps = {
    file: '',
  };

  setFile = memoizeOne((file) => {
    this.setState({ file: file || {} });
  }, _.isEqual);

  constructor(props) {
    super(props);
    this.state = {
      file: {},
    };
  }

  handleChange = (ev) => {
    const [file] = ev.target.files;
    file.preview = URL.createObjectURL(file);
    this.setState({ file });
    this.props.onChange(ev, file);
    ev.target.value = '';
  };

  render() {
    const { file } = this.state;
    const {
      file: propFile,
      ...props
    } = this.props;
    this.setFile(propFile);

    return (
      <label className="fileInput">
        <div>
          <img
            className="image"
            src={_.isObject(file) ? (file.preview ? file.preview : Default) : file}
            alt={file.name}
          />
        </div>
        {_.isEmpty(file) ? <p className="buttonFile">Please Select File</p> : null}
        <input {...props} type="file" onChange={this.handleChange} />
      </label>
    );
  }
}

export default FileInput;
