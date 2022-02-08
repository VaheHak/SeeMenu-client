import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import QRCode from 'qrcode.react';
import PropTypes from 'prop-types';

class DynamicTemplate2 extends Component {
  static propTypes = {
    tableName: PropTypes.object.isRequired,
    restaurantName: PropTypes.object.isRequired,
    tableNameStyle: PropTypes.object.isRequired,
    titleStyle: PropTypes.object.isRequired,
    subTitleStyle: PropTypes.object.isRequired,
    background: PropTypes.object.isRequired,
    tables: PropTypes.object.isRequired,
    restaurantData: PropTypes.object.isRequired,
    qrValue: PropTypes.any.isRequired,
  };

  render() {
    const {
      tableName,
      restaurantName,
      tableNameStyle,
      titleStyle,
      subTitleStyle,
      background,
      tables,
      restaurantData,
      qrValue,
    } = this.props;

    return (
      <div
        key={_.uniqueId('key')}
        className={`qr__code qr${tables?.id}`}
      >
        <div className="qr__code_row">
          <div className="qr__restaurant_name" style={background}>
            <h1 style={restaurantName}>
              {restaurantData?.name}
            </h1>
          </div>
          <div className="arrow__down" />
          <div className="qr__table_number">
            <h4>Table</h4>
            <h3 style={tableNameStyle}>
              {tableName}
            </h3>
          </div>
        </div>
        <div className="qr__container">
          <div className="qr__content">
            <h3 style={titleStyle}>Scan this QR code</h3>
            <p style={titleStyle}>
              With your phone`s camera
            </p>
            <br />
            <h6 style={subTitleStyle}>
              View our menu online
            </h6>
          </div>
          <div className="qr__block">
            <QRCode
              value={qrValue}
              size={100}
            />
          </div>
          <div className="our__logo">
            <img src="/see_menu_orange.png" alt="SeeMenu" />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};
const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DynamicTemplate2);

export default Container;
