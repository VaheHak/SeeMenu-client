import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import memoizeOne from 'memoize-one';
import _ from 'lodash';
import arrowRightImage from '../assets/icons/right-arrow.png';
import arrowDownImage from '../assets/icons/down-arrow.png';
import edit from '../assets/icons/edit.png';
import deleteIcon from '../assets/icons/delete.png';
import { updateTable } from '../store/actions/table';

class TableRect extends Component {
  static propTypes = {
    tables: PropTypes.array.isRequired,
    edit: PropTypes.func.isRequired,
    updateTable: PropTypes.func.isRequired,
    deleted: PropTypes.func.isRequired,
  };

  svgTable = memoizeOne((tables) => {
    if (!_.isEmpty(tables)) {
      this.svg = d3.selectAll('.tableSvg')
        .attr('viewBox', [0, 0, window.screen.width - 430, 600]);

      this.wrapper = this.svg.selectAll('.wrapper');

      if (!this.wrapper.empty()) {
        this.wrapper.remove();
      }
      this.wrapper = this.svg.append('g')
        .attr('class', 'wrapper');

      this.svg.call(d3.zoom()
        .on('zoom', this.zoomed));

      this.g = this.wrapper.selectAll('.group')
        .data(tables)
        .join('g')
        .attr('class', 'group')
        .attr('transform', (d) => `translate(${d.position.positionX}, ${d.position.positionY})`);

      this.rect = this.g.append('rect')
        .attr('width', (d) => d.position.width)
        .attr('height', (d) => d.position.height)
        .attr('class', 'table')
        .attr('rx', '15')
        .style('fill', '#ea785a');

      this.text = this.g.append('text')
        .attr('x', (d) => d.position.width / 2 - 10)
        .attr('y', (d) => d.position.height / 2 - 10)
        .attr('dominantBaseline', 'middle')
        .attr('textAnchor', 'middle')
        .attr('class', 'text')
        .style('fill', 'white')
        .style('cursor', 'pointer')
        .style('font-size', '22')
        .text((d) => _.truncate(d.number, {
          length: 5,
          separator: ' ',
        }));

      this.textHover = this.g.append('text')
        .attr('x', (d) => d.position.width / 2)
        .attr('y', (d) => d.position.height / 3 - 17)
        .attr('dominantBaseline', 'middle')
        .attr('textAnchor', 'middle')
        .attr('class', 'textHover')
        .style('fill', 'white')
        .style('cursor', 'pointer')
        .style('font-size', '22')
        .text((d) => d.number);

      this.arrowRight = this.g.append('image')
        .attr('width', '20')
        .attr('height', '20')
        .attr('x', (d) => d.position.width - 8)
        .attr('y', (d) => d.position.height / 2 - 10)
        .attr('xlink:href', arrowRightImage);

      this.arrowDown = this.g.append('image')
        .attr('width', '20')
        .attr('height', '20')
        .attr('x', (d) => d.position.width / 2 - 10)
        .attr('y', (d) => d.position.height - 8)
        .attr('xlink:href', arrowDownImage);

      this.div = this.g.append('g')
        .attr('transform', (d) => `translate(${d.position.width - 30}, ${d.position.height - 30})`);

      this.edit = this.div.append('image')
        .attr('width', '20')
        .attr('height', '20')
        .attr('x', 0)
        .attr('y', 0)
        .attr('xlink:href', edit);

      this.delete = this.div.append('image')
        .attr('width', '20')
        .attr('height', '20')
        .attr('x', -30)
        .attr('y', 0)
        .attr('xlink:href', deleteIcon)
        .style('color', 'red');

      this.g.call(d3.drag()
        .on('drag', this.drag)
        .on('end', this.end));

      this.arrowRight.call(d3.drag()
        .on('drag', this.rightDrag)
        .on('end', this.end));

      this.arrowDown.call(d3.drag()
        .on('drag', this.downDrag)
        .on('end', this.end));

      this.edit.on('click', (ev, datum) => this.props.edit(datum.id));
      this.delete.on('click', (ev, datum) => this.props.deleted(datum.id));
    }
  }, _.isEqual);

  componentDidMount() {
    const { tables } = this.props;
    this.svgTable(tables, this.ref);
  }

  componentWillUnmount() {
    this.g?.on('drag', null);
  }

  zoomed = ({ transform }) => {
    this.wrapper.attr('transform', transform);
  }

  end = async (ev, datum) => {
    await this.props.updateTable(datum);
  };

  drag = (ev, datum) => {
    const {
      dx,
      dy,
    } = ev;

    datum.position.positionX += dx;
    datum.position.positionY += dy;

    this.g
      .attr('transform', (d) => `translate(${d.position.positionX}, ${d.position.positionY})`);
  };

  rightDrag = (ev, datum) => {
    const {
      dx,
    } = ev;

    const width = +datum.position.width + dx;

    if (width >= 100) {
      datum.position.width = width;

      this.rect
        .attr('width', (d) => d.position.width);

      this.arrowRight
        .attr('x', (d) => d.position.width - 8)
        .attr('y', (d) => d.position.height / 2 - 10);

      this.arrowDown
        .attr('x', (d) => d.position.width / 2 - 10)
        .attr('y', (d) => d.position.height - 8);

      this.text
        .attr('x', (d) => d.position.width / 2 - 10)
        .attr('y', (d) => d.position.height / 2 - 10);

      this.div
        .attr('transform', (d) => `translate(${d.position.width - 60}, ${d.position.height - 30})`);

      this.edit
        .attr('x', 0)
        .attr('y', 0);

      this.delete
        .attr('x', -30)
        .attr('y', 0);

      this.textHover
        .attr('x', (d) => d.position.width / 2)
        .attr('y', (d) => d.position.height / 3 - 17);
    }
  };

  downDrag = (ev, datum) => {
    const {
      dy,
    } = ev;

    const height = +datum.position.height + dy;

    if (height >= 100) {
      datum.position.height = height;

      this.rect
        .attr('height', (d) => d.position.height);

      this.arrowDown
        .attr('x', (d) => d.position.width / 2 - 10)
        .attr('y', (d) => d.position.height - 8);

      this.arrowRight
        .attr('x', (d) => d.position.width - 8)
        .attr('y', (d) => d.position.height / 2 - 10);

      this.text
        .attr('x', (d) => d.position.width / 2 - 10)
        .attr('y', (d) => d.position.height / 2 - 10);

      this.div
        .attr('transform', (d) => `translate(${d.position.width - 60}, ${d.position.height - 30})`);

      this.edit
        .attr('x', 0)
        .attr('y', 0);

      this.delete
        .attr('x', -30)
        .attr('y', 0);

      this.textHover
        .attr('x', (d) => d.position.width / 2)
        .attr('y', (d) => d.position.height / 3 - 17);
    }
  };

  render() {
    const { tables } = this.props;

    this.svgTable(tables, this.ref);

    return (
      <svg
        className="tableSvg"
        ref={(ref) => {
          this.ref = ref;
        }}
      />
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  updateTable,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TableRect);

export default withRouter(Container);
