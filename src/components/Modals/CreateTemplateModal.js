import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { Button } from '@material-ui/core';
import { ArrowDownward, Close, SystemUpdateAlt } from '@material-ui/icons';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode.react';
import domtoimage from 'dom-to-image';
import { lightGreen } from '@material-ui/core/colors';
import generateZip from '../Zip';

// import { ArrowDownward } from '../../pages/EditImage';

class CreateTemplateModal extends Component {
  static propTypes = {
    order: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,

  };

  generateFunc = async (order) => {
    // const canvasList = await Promise.all(_.map(data, (o) => html2canvas(o, { allowTaint: true })));
    // console.log(canvasList);
    // const pdf = new jsPDF();
    // if (pdf) {
    //   domtoimage.toPng(input)
    //     .then((imgData) => {
    //       pdf.addImage(imgData, 'PNG', 10, 10);
    //       pdf.save('download.pdf');
    //     });
    // }

    const data = document.getElementsByClassName(`qr${order.id}`);
    const canvasList = await Promise.all(_.map(data, (o) => html2canvas(o, { allowTaint: true })));
    const blobList = await Promise.all(canvasList.map((canvas) => new Promise((resolve) => canvas.toBlob(resolve))));
    generateZip(blobList, order);
  };

  render() {
    const { order, close } = this.props;
    return (
      <div>
        <Modal
          isOpen
          onRequestClose={close}
          overlayClassName="templateModal"
        >
          <div className="templateModal_content">
            <div className="closeButton">
              <Close onClick={close} />
            </div>
            {order.template !== 1 ? (
              _.map(order.tables, (value, id) => (
                <div key={_.uniqueId('key')} className={`qr__code qr${order.id}`}>
                  <div className="qr__code_row">
                    <div className="qr__restaurant_name">
                      <h1 style={order.styles.restaurantName}>
                        {order.qrOrderRest?.name}
                      </h1>
                    </div>
                    <div className="arrow__down" />
                    <div className="qr__table_number">
                      <h4>Table</h4>
                      <h3 style={order.styles.tableName}>
                        {id}
                      </h3>
                    </div>
                  </div>
                  <div className="qr__container">
                    <div className="qr__content">
                      <h3 style={order.styles.titleStyle}>Scan this QR code</h3>
                      <p style={order.styles.titleStyle}>With your phone`s camera</p>
                      <br />
                      <strong style={{ color: 'rgba(0, 0, 0, 0.8)' }}>View our menu online</strong>
                    </div>
                    <div className="qr__block">
                      <QRCode
                        value={value.link}
                        size={150}
                      />
                    </div>
                    <div className="our__logo">
                      <img src="/see_menu_orange.png" alt="SeeMenu" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              _.map(order.tables, (value, id) => (
                <div
                  key={_.uniqueId('key')}
                  className={`qr__code1 qr${order.id}`}
                  style={{ backgroundImage: `url(${order.qrOrderRest.cover})` }}
                >
                  <div className="qr__code_row1">
                    <div className="qr__restaurant_name1">
                      <h1 style={order.styles.restaurantName}>
                        {order.qrOrderRest?.name}
                      </h1>
                    </div>
                    <div className="qr__table_number">
                      <h4>Table</h4>
                      <h3 style={order.styles.tableName}>
                        {id}
                      </h3>
                    </div>
                  </div>
                  <div className="qr__container1">
                    <div className="qr__content">
                      <ArrowDownward />
                      <h3 style={order.styles.titleStyle}>Scan this QR code</h3>
                      <p style={order.styles.titleStyle}>
                        With your phone`s camera
                      </p>
                      <br />
                      <h6 style={order.styles.subTitleStyle}>
                        View our menu online
                      </h6>
                    </div>
                    <div className="qr__block">
                      <QRCode
                        value={value.link}
                        size={100}
                      />
                    </div>
                    <div className="our__logo">
                      <img src="/see_menu_orange.png" alt="SeeMenu" />
                    </div>
                  </div>
                </div>
              ))

            )}
          </div>
          <Button
            type="button"
            size="small"
            className="buttonDownload"
            onMouseDown={() => this.generateFunc(order)}
            onClick={close}
          >
            <SystemUpdateAlt />
          </Button>

        </Modal>
      </div>

    );
  }
}

const mapStateToProps = () => (
  {}
);

const mapDispatchToProps = {};
const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateTemplateModal);

export default Container;
