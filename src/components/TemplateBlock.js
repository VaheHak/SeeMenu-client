import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import First from '../assets/images/templateOne.png';
import Second from '../assets/images/templateTwo.png';
import { changeImage } from '../store/actions/qr';

class TemplateBlock extends Component {
  static propTypes = {
    imageNumber: PropTypes.any.isRequired,
    orderQr: PropTypes.object.isRequired,
    changeImage: PropTypes.func.isRequired,
    roleState: PropTypes.bool.isRequired,
  };

  handleClick = (im) => {
    this.props.changeImage(im);
  };

  render() {
    const { orderQr, imageNumber, roleState } = this.props;

    return (
      <div className="templateBlock">
        <div className="imagesBlock">
          <img
            src={First}
            alt="template-one"
            className={orderQr?.template === 1 || imageNumber === 1 ? 'imageBorder' : null}
            onClick={!roleState ? () => this.handleClick(1) : null}
          />
          <img
            src={Second}
            alt="template-two"
            className={orderQr?.template === 2 || imageNumber === 2 ? 'imageBorder' : null}
            onClick={!roleState ? () => this.handleClick(2) : null}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  changeImage,
};
const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TemplateBlock);

export default Container;
