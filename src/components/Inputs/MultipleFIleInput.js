import React, { Component } from 'react';
import memoizeOne from 'memoize-one';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Default from '../../assets/images/default.png';

class FileInput extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    files: PropTypes.any,
  };

  static defaultProps = {
    files: '',
  };

  setFile = memoizeOne((files) => {
    this.setState({ files: files || [] });
  }, _.isEqual);

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      countError: false,
    };
  }

  handleChange = (ev) => {
    const files = [...ev.target.files];

    if (files.length > 5) {
      this.setState({
        countError: true,
        files: [],
      });
    } else {
      _.map(files, (file) => {
        file.preview = URL.createObjectURL(file);
      });

      this.setState({
        files,
        countError: false,
      });
      this.props.onChange(ev, files);
    }

    ev.target.value = '';
  };

  deleteError = () => this.setState({
    countError: false,
  });

  render() {
    const {
      files,
      countError,
    } = this.state;
    const {
      files: propFiles,
      ...props
    } = this.props;

    this.setFile(propFiles);

    return (
      <label className="fileInput">
        <div className="images">
          {_.map(files, (file, index) => (
            <img
              key={index}
              className="image"
              src={_.isObject(file) ? (file.preview ? file.preview : Default) : file}
              alt={file.name}
            />
          ))}
        </div>
        <p className="buttonFile">Please Select Files</p>
        <input {...props} type="file" multiple onChange={this.handleChange} />
        {countError ? <p className="errorText">Sorry, max count is 5!</p> : null}
      </label>
    );
  }
}

export default FileInput;
