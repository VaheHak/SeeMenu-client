import React, { Component } from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Cancel, CheckCircleOutline } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { userActivateRequest } from '../store/actions/login';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#09ad6b' },
  },
});

class Verify extends Component {
  static propTypes = {
    userActivateRequest: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {},
    };
  }

  async componentDidMount() {
    const formData = {
      activationCode: this.props.match.params.key,
    };

    const { payload: { data } } = await this.props.userActivateRequest(formData);

    this.setState({
      loading: false,
      data,
    });
  }

  render() {
    const { loading, data } = this.state;

    return (
      <div className="verify">
        {loading
          ? (
            <div className="loadingBLock">
              <div className="loading">
                <MuiThemeProvider theme={theme}>
                  <CircularProgress color="primary" size={70} />
                </MuiThemeProvider>
                <span className="loadingText">Please wait ...</span>
              </div>
            </div>
          ) : (
            <>
              { data.errors
                ? (
                  <div className="containBlock">
                    <div className="requestIconBlock">
                      <div className="container">
                        <Cancel style={{
                          fontSize: 170,
                          color: 'red',
                        }}
                        />
                      </div>
                    </div>
                    <div className="requestTextBlock">
                      <div className="container">
                        <span className="errorText">Sorry, we do not find you in our site!</span>
                        <span className="registerText">Please, register in our site.</span>
                        <Link to="/register">
                          <button type="button" className="verifyButton">REGISTER</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
                : (
                  <div className="containBlock">
                    <div className="requestIconBlock">
                      <div className="container">
                        <CheckCircleOutline style={{
                          fontSize: 170,
                          color: 'green',
                        }}
                        />
                      </div>
                    </div>
                    <div className="requestTextBlock">
                      <div className="container">
                        <span className="successText">Thanks for verifying your email!</span>
                        <Link to="/login">
                          <button type="button" className="verifyButton">LOGIN</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) }
            </>
          )}
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  userActivateRequest,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Verify);

export default Container;
