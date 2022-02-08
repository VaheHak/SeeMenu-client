import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from './header';
import { chooseUser } from '../store/actions/user';
import Management from './Management';

class Wrapper extends Component {
    static propTypes = {
      chooseUser: PropTypes.func.isRequired,
      token: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      children: PropTypes.any.isRequired,
    };

    componentDidMount() {
      const { token } = this.props;
      if (token) {
        this.props.chooseUser();
      }
    }

    render() {
      const { token, children, role } = this.props;

      if (!token) {
        return <Redirect to="/login" />;
      }

      return (
        <div className="userProfile">
          <Header />
          <main className="main">
            <div className="row">
              <Management role={role} />
              {children}
            </div>
          </main>
        </div>
      );
    }
}

const mapStateToProps = (state) => ({
  token: state.login.token,
  role: state.login.role,
});
const mapDispatchToProps = {
  chooseUser,
};
const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Wrapper);

export default Container;
