import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Person, Settings, ExitToApp } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { deleteToken } from '../store/actions/login';

class Header extends Component {
  static propTypes = {
    person: PropTypes.object.isRequired,
    deleteToken: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      controlBlock: false,
    };
  }

  controlBlock = () => {
    const { controlBlock } = this.state;

    this.setState({
      controlBlock: !controlBlock,
    });
  };

  controlBlockClose = (ev) => {
    if (ev.target.classList.contains('closeControl')) {
      this.controlBlock();
    }
  };

  logOut = () => {
    this.props.deleteToken();
  };

  render() {
    const { person } = this.props;
    const { controlBlock } = this.state;

    return (
      <header className="header">
        <div className="row">
          <Link className="userInfo" to="/user/restaurants">
            <span>{person.firstName}</span>
            <span className="userSurname">{person.lastName}</span>
          </Link>
          <nav className="profileControlBlock">
            <Person className="personIcon" onClick={this.controlBlock} />
            {controlBlock ? (
              <div className="closeControl" onClick={this.controlBlockClose}>
                <ul className="controlBlock">
                  <li>
                    <Link to={`/user/${person.id}/edit`}>
                      <Settings className="controlIcon" />
                      <span>My account</span>
                    </Link>
                  </li>
                  <li onClick={this.logOut}>
                    <ExitToApp className="controlIcon" />
                    <span>Log out</span>
                  </li>
                </ul>
              </div>
            ) : null}
          </nav>
        </div>
      </header>

    );
  }
}

const mapStateToProps = (state) => ({
  person: state.user.result,
});

const mapDispatchToProps = {
  deleteToken,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);

export default Container;
