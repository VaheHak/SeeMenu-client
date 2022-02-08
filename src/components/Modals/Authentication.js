import React, { Component } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { Close, VpnKey } from '@material-ui/icons';
import { connect } from 'react-redux';
import _ from 'lodash';
import factor from '../../assets/images/authentication.png';
import { twoFactorAuthentication } from '../../store/actions/login';

class Authentication extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    twoFactorAuthentication: PropTypes.func.isRequired,
    uniqKey: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      formData: {},
    };
  }

  componentDidMount() {
    const { formData } = this.state;
    const { uniqKey } = this.props;

    _.set(formData, 'uniqKey', uniqKey);

    this.setState({
      formData: { ...formData },
    });
  }

  handleChange = (path, value) => {
    const { formData } = this.state;

    _.set(formData, path, value);

    this.setState({
      formData: { ...formData },
    });
  };

  handleClick = async () => {
    const { formData } = this.state;

    await this.props.twoFactorAuthentication(formData);

    this.props.close();
  };

  render() {
    const { formData } = this.state;

    const {
      close,
    } = this.props;

    return (
      <Modal
        isOpen
        onRequestClose={close}
        overlayClassName="AuthenticationModal"
      >
        <div className="closeBlock">
          <Close onClick={close} className="close" />
        </div>
        <div className="imageBlock">
          <img src={factor} alt="authentication" />

          <div className="textInfo">
            <span>Two Factor Authentication</span>
            <p>
              A verification code has been sent to your email. This code will be valid for 3
              minutes.
            </p>
            <div className="TwoFactorBlock">
              <VpnKey className="key" />
              <input
                type="text"
                className="inputText"
                onChange={(ev) => this.handleChange('digitCode', ev.target.value)}
                value={formData.digitCode}
              />
              <button type="button" className="verifyButton" onClick={this.handleClick}>
                Verify
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  twoFactorAuthentication,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Authentication);

export default Container;
