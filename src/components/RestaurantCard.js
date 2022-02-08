import React, { Component } from 'react';
import {
  LocationOn,
  Smartphone, Language, Schedule, Edit,
} from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Button,
  CardActions,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Switch,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import _ from 'lodash';
import CreateRestaurantModal from './Modals/CreateRestaurantModal';
import {
  getRestaurantList,
  getSingleRestaurant,
  getBranches,
  closeRestaurantChange,
  updateStatus,
} from '../store/actions/restaurant';
import { getAllRestaurants } from '../store/actions/restaurantsList';

class RestaurantCard extends Component {
  static propTypes = {
    getRestaurantList: PropTypes.func.isRequired,
    closeRestaurantChange: PropTypes.func.isRequired,
    getSingleRestaurant: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    getBranches: PropTypes.func.isRequired,
    getAllRestaurants: PropTypes.func.isRequired,
    res: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    edit: PropTypes.bool.isRequired,
    branch: PropTypes.bool.isRequired,
    updateStatus: PropTypes.func.isRequired,
    role: PropTypes.string.isRequired,
  };

  initStatus = memoizeOne((status) => {
    this.setState({
      status,
    });
  }, _.isEqual);

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      restaurantId: '',
      status: true,
    };
  }

  openModal = async (ev) => {
    let restaurantId = '';

    if (ev === 'edit') {
      restaurantId = ev;
      await this.props.getSingleRestaurant(this.props.res.id, 'en');
    } else {
      restaurantId = ev;
      await this.props.getSingleRestaurant(ev, 'en');
    }
    this.setState({
      modalIsOpen: true,
      restaurantId,
    });
  };

  closeModal = async (id) => {
    const { role } = this.props;
    if (role === 'superadmin') {
      await this.props.getAllRestaurants('');
    } else {
      await this.props.closeRestaurantChange();
      await this.props.getRestaurantList();
      if (id || this.props.match.params.id) {
        await this.props.getBranches(this.props.match.params.id || id);
      }
    }
    this.setState({
      modalIsOpen: false,
    });
  };

  changeResStatus = () => {
    const { res } = this.props;
    const { status } = this.state;

    this.props.updateStatus(res.id, !status);
    this.setState({
      status: !status,
    });
  };

  render() {
    const {
      modalIsOpen,
      restaurantId,
      status,
    } = this.state;

    const {
      res,
      edit,
      branch,
      role,
    } = this.props;

    this.initStatus(res.status);

    return (
      <div className="restaurantCard">
        <Card>
          <CardActionArea
            onClick={() => this.props.push(res.id, res.branchId)}
          >
            <CardMedia
              component="img"
              alt="Contemplative Reptile"
              height="140"
              image={res.cover}
              title="Contemplative Reptile"
            />
            <CardContent>
              <div className="nameBlock">
                <Typography gutterBottom variant="h5" component="h2">
                  {res.name}
                </Typography>
                <img className="logoStyle" src={res.logo} alt={res.name} />
              </div>
              <nav className="cardNavigationBlock">
                <ul className="cardNavigationBlockUl">
                  <li>
                    <LocationOn />
                    <p title={res.address}>
                      {_.truncate(res.address, {
                        length: 22,
                        separator: '...',
                      })}
                    </p>
                  </li>
                  <li>
                    <Smartphone />
                    <p>{res.phone}</p>
                  </li>
                  <li>
                    <Language />
                    <p title={res.link}>
                      {_.truncate(res.link, {
                        length: 20,
                        separator: '...',
                      })}
                    </p>
                  </li>
                  <li>
                    <Schedule />
                    <p>{res.timing}</p>
                  </li>
                </ul>
              </nav>
              <Typography className="cardSubName" gutterBottom variant="h5" component="h2">
                {res.subName}
              </Typography>
            </CardContent>
          </CardActionArea>
          {edit
            ? (
              <CardActions>
                <div className="switch-holder">
                  <div className="switch-label">
                    <i className="fa fa-bluetooth-b"> </i>
                    <span>{status ? 'Activate' : 'Deactivate'}</span>
                  </div>
                  <div className="switch-toggle">
                    <Switch
                      checked={status}
                      onClick={this.changeResStatus}
                    />
                  </div>
                </div>
                <div className="createBranchBlock">
                  <Button size="small" color="primary" onClick={() => this.openModal('edit')}>
                    <Edit className="settings" />
                  </Button>
                  {role !== 'manager' && branch
                    ? (
                      <button
                        type="button"
                        className="branch"
                        onClick={() => this.openModal(res.id)}
                      >
                        <span>Add branch</span>
                      </button>
                    )
                    : null}
                </div>
              </CardActions>
            )
            : null}
        </Card>
        {modalIsOpen ? (
          <>
            {restaurantId === 'edit'
              ? (
                <CreateRestaurantModal
                  close={this.closeModal}
                  button="Update"
                  process="Restaurant Update"
                />
              )
              : (
                <CreateRestaurantModal
                  button="Create"
                  restaurantId={restaurantId}
                  close={this.closeModal}
                  process="Branch Create"
                />
              )}
          </>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  restStatus: state.restaurant.restStatus,
  role: state.login.role,
});

const mapDispatchToProps = {
  closeRestaurantChange,
  getRestaurantList,
  getSingleRestaurant,
  getBranches,
  updateStatus,
  getAllRestaurants,
};
const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RestaurantCard);

export default withRouter(Container);
