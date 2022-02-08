import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Close, ArrowBack } from '@material-ui/icons';
import {
  Button, Step, StepLabel, Stepper,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import SingleOrder from '../components/SingleOrder';
import {
  changeImage,
  ordering,
  singleOrder,
} from '../store/actions/qr';
import EditImage from './EditImage';
import { getSingleRestaurant } from '../store/actions/restaurant';
import TemplateBlock from '../components/TemplateBlock';

class OrderQrPage extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    imageNumber: PropTypes.any.isRequired,
    role: PropTypes.string.isRequired,
    order: PropTypes.object.isRequired,
    tables: PropTypes.object.isRequired,
    orderQr: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    restaurantData: PropTypes.object.isRequired,
    getSingleRestaurant: PropTypes.func.isRequired,
    viewOrder: PropTypes.any.isRequired,
    orderHistoryOpen: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
    };
  }

  async componentDidMount() {
    await this.props.getSingleRestaurant(this.props.match.params.id, 'en');
  }

  handleClickNext = (step) => {
    const {
      imageNumber, orderQr, order, tables, role,
    } = this.props;
    if (step === 1 && role !== 'superadmin') {
      if (!(_.isEmpty(order) || _.isEmpty(tables))) {
        this.setState({ activeStep: step });
      }
    } else if (step === 2 && role !== 'superadmin') {
      if ((typeof imageNumber === 'number' || typeof orderQr.template === 'number') && (!_.isEmpty(order) || !_.isEmpty(tables))) {
        this.setState({ activeStep: step });
      }
    } else {
      this.setState({ activeStep: step });
    }
  };

  render() {
    const {
      close,
      tables,
      imageNumber,
      order,
      restaurantData,
      orderQr,
      role,
      viewOrder,
      orderHistoryOpen,
    } = this.props;

    const {
      activeStep,
    } = this.state;

    let roleState;
    if ((role === 'superadmin')) {
      roleState = role;
    }

    return (
      <div className="orderQr" style={{ width: '100%' }}>
        {!roleState && !viewOrder
          ? <ArrowBack className="backButton" onClick={() => this.props.history.goBack()} /> : null}
        <div className="closeOrderBlock">
          <span>Order QR</span>
          <div className="closeButton">
            <Close onClick={close} />
          </div>
        </div>
        <div className="buttonsBlock">
          <Button
            variant="contained"
            className={activeStep !== 0 ? 'disabled' : 'orderTable'}
            onClick={() => this.handleClickNext(0)}
          >
            Tables
          </Button>
          {!viewOrder ? (
            <Button
              variant="contained"
              className={activeStep !== 1 ? 'disabled' : 'orderTable'}
              onClick={() => this.handleClickNext(1)}
            >
              Template
            </Button>
          ) : null}
          <Button
            variant="contained"
            className={activeStep !== 2 ? 'disabled' : 'orderTable'}
            onClick={() => this.handleClickNext(2)}
          >
            {!viewOrder ? 'Edit' : 'Template'}
          </Button>
        </div>
        {_.isEmpty(order) && _.isEmpty(tables) && _.isEmpty(orderQr) ? (
          <div className="not_orders">
            no Orders
          </div>
        ) : (
          <>
            {activeStep === 0 ? (
              <div className="tablesNameBlock">
                <div className="tableBlock">
                  {
                    _.isEmpty(orderQr) ? (
                      _.map(!_.isEmpty(tables) ? tables : order, (item) => (
                        <SingleOrder
                          key={_.uniqueId('item')}
                          item={item}
                          roleStat
                          control={!viewOrder}
                        />
                      ))
                    ) : (
                      _.map(orderQr?.tables, (item) => (
                        <SingleOrder
                          key={_.uniqueId('item')}
                          item={item}
                          tableName={Object.keys(item)[0]}
                          roleStat={false}
                        />
                      ))
                    )
                  }
                </div>
              </div>
            ) : null}
            {(activeStep === 1) && (!_.isEmpty(tables) || !_.isEmpty(order) || roleState) ? (
              <TemplateBlock
                orderQr={orderQr}
                imageNumber={imageNumber}
                roleState={roleState}
              />
            ) : null}
            {(activeStep === 2 || activeStep === 3) && (typeof imageNumber === 'number' || Number.isFinite(orderQr?.template)) ? (
              <div className="imagesEditBlock">
                {roleState ? (
                  <EditImage
                    order={order}
                    tables={tables}
                    orderQr={orderQr}
                    close={close}
                    viewOrder={viewOrder}
                    orderHistoryOpen={orderHistoryOpen}
                  />
                ) : (
                  <EditImage
                    order={orderHistoryOpen ? orderQr?.tables : order}
                    orderQr={orderQr}
                    tables={tables}
                    restaurantData={restaurantData}
                    imageNumber={imageNumber || orderQr.template}
                    viewOrder={viewOrder}
                    orderHistoryOpen={orderHistoryOpen}
                  />
                )}
              </div>
            ) : null}
            {!viewOrder ? (
              <Stepper activeStep={activeStep} alternativeLabel>
                <Step>
                  <StepLabel>
                    <div />
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel>
                    <div />
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel>
                    <div />
                  </StepLabel>
                </Step>
              </Stepper>
            ) : null}
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tables: state.table.tables,
  role: state.login.role,
  imageNumber: state.qr.image_number,
  singleOrder: state.qr.single_order,
  orderHistory: state.qr.order_history,
  order: state.qr.order,
  price: state.qr.price,
  restaurantData: state.restaurant.restaurantData || {},
});

const mapDispatchToProps = {
  changeImage,
  ordering,
  singleOrder,
  getSingleRestaurant,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderQrPage);

export default withRouter(Container);
