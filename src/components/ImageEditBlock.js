import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Accordion, AccordionDetails, AccordionSummary, Typography,
} from '@material-ui/core';
import { ChromePicker } from 'react-color';
import InputRange from 'react-input-range';
import _ from 'lodash';
import { ExpandMore } from '@material-ui/icons/';
import PropTypes from 'prop-types';
import { chooseStyles } from '../store/actions/orders';

class ImageEditBlock extends Component {
  static propTypes = {
    chooseStyles: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker0: false,
      displayColorPicker1: false,
      displayColorPicker2: false,
      displayColorPicker3: false,
      displayColorPicker4: false,
      displayColorPicker5: false,
      background: {
        backgroundColor: 'linear-gradient(#F08367, #F2BC57)',
      },
      restaurantName: {
        fontSize: 36,
      },
      tableName: {},
      titleStyle: {},
      subTitleStyle: {},
    };
  }

  resNameChange = (obj, path, val) => {
    const {
      restaurantName, tableName, titleStyle, subTitleStyle,
    } = this.state;
    this.setState((prevState) => ({
      [obj]: {
        ...prevState[obj],
        [path]: val,
      },
    }));
    this.props.chooseStyles(restaurantName, tableName, titleStyle, subTitleStyle);
  };

  handleClick = (num) => {
    const isOpen = `displayColorPicker${num}`;
    this.setState({ [isOpen]: true });
  };

  handleClose = (num) => {
    const isOpen = `displayColorPicker${num}`;
    this.setState({ [isOpen]: false });
  };

  render() {
    const {
      tableName, restaurantName, titleStyle, subTitleStyle, background,
    } = this.state;

    const popover = {
      position: 'absolute',
      zIndex: '2',
    };
    const cover = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    };

    return (
      <div className="edit_block">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>RestaurantName</Typography>
          </AccordionSummary>
          <AccordionDetails className="AccordionDetails">
            <ul>
              <li>
                <div>
                  <button type="button" className="button" onClick={() => this.handleClick(0)}>
                    Change Background Color
                  </button>
                  {this.state.displayColorPicker0 ? (
                    <div style={popover}>
                      <div style={cover} onClick={() => this.handleClose(0)} />
                      <ChromePicker
                        color={background.backgroundColor}
                        onChange={(value) => this.resNameChange('background', 'backgroundColor', value.hex)}
                      />
                    </div>
                  ) : null}
                </div>
              </li>
              <li>
                <button type="button" className="button" onClick={() => this.handleClick(1)}>
                  Change Color
                </button>
                <div>
                  {this.state.displayColorPicker1 ? (
                    <div style={popover}>
                      <div style={cover} onClick={() => this.handleClose(1)} />
                      <ChromePicker
                        color={restaurantName.color}
                        onChange={(value) => this.resNameChange('restaurantName', 'color', value.hex)}
                      />
                    </div>
                  ) : null}
                </div>
              </li>
              <li>
                <p>Font-Size</p>
                <InputRange
                  maxValue={45}
                  minValue={18}
                  value={restaurantName.fontSize || 18}
                  onChange={(value) => this.resNameChange('restaurantName', 'fontSize', value)}
                />
              </li>
              <li>
                <p>Rotate</p>
                <InputRange
                  minValue={-180}
                  maxValue={180}
                  value={_.split(_.split(restaurantName.transform, '(')[1], 'd')[0] || 0}
                  onChange={(value) => this.resNameChange('restaurantName', 'transform', `rotate(${value}deg)`)}
                />
              </li>
            </ul>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>TableName</Typography>
          </AccordionSummary>
          <AccordionDetails className="AccordionDetails">
            <ul>
              <li>
                <button type="button" className="button" onClick={() => this.handleClick(2)}>
                  Change Color
                </button>
                {this.state.displayColorPicker2 ? (
                  <div style={popover}>
                    <div style={cover} onClick={() => this.handleClose(2)} />
                    <ChromePicker
                      color={tableName.color}
                      onChange={(value) => this.resNameChange('tableName', 'color', value.hex)}
                    />
                  </div>
                ) : null}
              </li>
              <li>
                <p>Change Font-Size</p>
                <InputRange
                  maxValue={35}
                  minValue={18}
                  value={tableName.fontSize || 18}
                  onChange={(value) => this.resNameChange('tableName', 'fontSize', value)}
                />
              </li>
              <li>
                <p>Rotate</p>
                <InputRange
                  minValue={-180}
                  maxValue={180}
                  value={_.split(_.split(tableName.transform, '(')[1], 'd')[0] || 0}
                  onChange={(value) => this.resNameChange('tableName', 'transform', `rotate(${value}deg)`)}
                />
              </li>
            </ul>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1bh-content"
            id="panel2a-header"
            className="AccordionSummary"
          >
            <Typography>Heading</Typography>
          </AccordionSummary>
          <AccordionDetails className="AccordionDetails">
            <ul>
              <li>
                <button type="button" className="button" onClick={() => this.handleClick(3)}>
                  Change Color
                </button>
                <div>
                  {this.state.displayColorPicker3 ? (
                    <div style={popover}>
                      <div style={cover} onClick={() => this.handleClose(3)} />
                      <ChromePicker
                        color={titleStyle.color}
                        onChange={(value) => this.resNameChange('titleStyle', 'color', value.hex)}
                      />
                    </div>
                  ) : null}
                </div>
              </li>
              <li>
                <p>Change Font-Size</p>
                <InputRange
                  maxValue={28}
                  minValue={16}
                  value={titleStyle.fontSize || 18}
                  onChange={(value) => this.resNameChange('titleStyle', 'fontSize', value)}
                />
              </li>
              <li>
                <p>Rotate</p>
                <InputRange
                  minValue={-180}
                  maxValue={180}
                  value={_.split(_.split(titleStyle.transform, '(')[1], 'd')[0] || 0}
                  onChange={(value) => this.resNameChange('titleStyle', 'transform', `rotate(${value}deg)`)}
                />
              </li>

            </ul>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1bh-content"
            id="panel2a-header"
          >
            <Typography>SubTitle</Typography>
          </AccordionSummary>
          <AccordionDetails className="AccordionDetails">
            <ul>
              <li>
                <button type="button" onClick={() => this.handleClick(4)} className="button">
                  Change Color
                </button>
                <div>
                  {this.state.displayColorPicker4 ? (
                    <div style={popover}>
                      <div style={cover} onClick={() => this.handleClose(4)} />
                      <ChromePicker
                        color={subTitleStyle.color}
                        onChange={(value) => this.resNameChange('subTitleStyle', 'color', value.hex)}
                      />
                    </div>
                  ) : null}
                </div>
              </li>
              <li>
                <p> Change Font-Size</p>
                <InputRange
                  maxValue={30}
                  minValue={14}
                  value={subTitleStyle.fontSize || 18}
                  onChange={(value) => this.resNameChange('subTitleStyle', 'fontSize', value)}
                />
              </li>
              <li>
                <p>Rotate</p>
                <InputRange
                  minValue={-180}
                  maxValue={180}
                  value={_.split(_.split(subTitleStyle.transform, '(')[1], 'd')[0] || 0}
                  onChange={(value) => this.resNameChange('subTitleStyle', 'transform', `rotate(${value}deg)`)}
                />
              </li>
            </ul>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  chooseStyles,
};
const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImageEditBlock);

export default Container;
