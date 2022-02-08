import React, { Component } from 'react';
import Checkbox from 'rc-checkbox';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import _ from 'lodash';
import Input from './Inputs/Input';

class SubMenu extends Component {
  static propTypes = {
    el: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    change: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    names: PropTypes.object,
  };

  static defaultProps = {
    names: undefined,
  };

  initCheck = memoizeOne((main) => {
    this.setState({
      check: main,
    });
  }, _.isEqual);

  constructor(props) {
    super(props);
    this.state = {
      check: false,
    };
  }

  handleChange = () => {
    const { check } = this.state;
    const {
      lang,
      change,
      index,
    } = this.props;

    change('main', !check, lang, index);

    this.setState({
      check: !check,
    });
  };

  render() {
    const {
      el,
      lang,
      change,
      index,
      names,
    } = this.props;

    const {
      check,
    } = this.state;

    this.initCheck(el.main === 'true');

    return (
      <div className="typesBlockInputs">
        <div className="inputs">
          <Checkbox
            checked={check}
            onChange={this.handleChange}
          />
          <Input
            type="text"
            className="typeName"
            value={el.type}
            onChange={(ev) => change('type', ev.target.value, lang, index)}
          />
          <Input
            type="text"
            className="typePrice"
            value={el.price}
            onChange={(ev) => change('price', ev.target.value, lang, index)}
          />
        </div>
        {names ? (
          <div className="itemNames">
            {_.map(Object.keys(names), (l, int) => {
              if (l !== lang) {
                return (
                  <p key={int}>
                    {`${names[l]}`}
                  </p>
                );
              }
            })}
          </div>
        ) : null}
      </div>
    );
  }
}

export default SubMenu;
