import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { globalUpdateChange } from '../../store/actions/menu';

class MenuAccordion extends Component {
  static propTypes = {
    disable: PropTypes.bool.isRequired,
    el: PropTypes.object.isRequired,
    sourceId: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    globalUpdateChange: PropTypes.func.isRequired,
  };

  initElem = memoizeOne((elem) => {
    if (_.isEmpty(elem)) {
      return;
    }
    const { formData } = this.state;

    _.map(elem, (value, path) => {
      _.set(formData, path, value);
    });

    this.setState({
      formData: { ...formData },
    });
  }, _.isEqual);

  constructor(props) {
    super(props);
    this.state = {
      defaultValue: '',
      formData: {},
    };
  }

  priceChange = (id, value, index) => {
    const { formData } = this.state;
    const { el } = this.props;

    if (value >= 0 && !_.isEmpty(value)) {
      this.props.globalUpdateChange(id, value, index);

      this.setState({
        formData: {
          ...formData,
          price: value,
        },
      });
    } else if (_.isEmpty(value)) {
      this.props.globalUpdateChange(id, el.price, index);

      this.setState({
        formData: {
          ...formData,
          price: value,
        },
      });
    } else {
      this.setState({
        formData: {
          ...formData,
          price: el.price,
        },
      });
    }
  };

  render() {
    const {
      disable,
      el,
      sourceId,
      index,
    } = this.props;

    const {
      defaultValue,
      formData,
    } = this.state;

    this.initElem(el, el.price);

    return (
      <div className="typesBlockItem">
        <p
          title={formData.type}
          className="typeName"
        >
          {_.truncate(formData.type, {
            length: 10,
            separator: '...',
          })}
        </p>
        <input
          type="number"
          value={defaultValue || formData.price}
          disabled={disable}
          className="priceInput"
          name="price"
          onChange={(ev) => this.priceChange(sourceId, ev.target.value, index)}
        />
        <span>amd</span>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  globalUpdateChange,
};
const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MenuAccordion);

export default withRouter(Container);
