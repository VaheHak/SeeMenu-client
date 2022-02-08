import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import QRCode from 'qrcode.react';
import { ArrowDownward } from '@material-ui/icons';
import PropTypes from 'prop-types';

class DynamicTemplate1 extends Component {
  static propTypes = {
    tableName: PropTypes.object.isRequired,
    restaurantName: PropTypes.object.isRequired,
    tableNameStyle: PropTypes.object.isRequired,
    titleStyle: PropTypes.object.isRequired,
    subTitleStyle: PropTypes.object.isRequired,
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
      tables,
      restaurantData,
      qrValue,
    } = this.props;

    return (
      <div
        key={_.uniqueId('key')}
        className={`qr__code1 qr${tables.id}`}
        style={{ backgroundImage: `url(${restaurantData?.cover})` }}
      >
        <div className="qr__code_row1">
          <div className="qr__restaurant_name1">
            <h1 style={restaurantName}>
              {restaurantData?.name}
            </h1>
          </div>
          <div className="qr__table_number">
            <h4>Table</h4>
            <h3 style={tableNameStyle}>
              {tableName}
            </h3>
          </div>
        </div>
        <div className="qr__container1">
          <div className="qr__content">
            <ArrowDownward />
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
)(DynamicTemplate1);

export default Container;
