import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import OrderQr from './OrderQr';
import Wrapper from '../components/Wrapper';

class OrderQrPage extends Component {
  render() {
    return (
      <Wrapper>
        <div className="restaurantBlock">
          <div className="restaurants">
            <div className="restaurantList">
              <OrderQr />
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderQrPage);

export default withRouter(Container);
