import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Wrapper from '../components/Wrapper';
import { getBranches } from '../store/actions/restaurant';
import { getOrdersAll } from '../store/actions/orders';
import { ordering, singleOrder } from '../store/actions/qr';
import DataPicker from '../components/Inputs/DataPicker';
import TemplatesTr from '../components/Tables/TemplatesTr';

class Templates extends Component {
  static propTypes = {
    getOrdersAll: PropTypes.func.isRequired,
    orders: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchData: {},
      searchTime: null,
      date: new Date(),
      status: { value: '', label: 'all' },
    };
    this.status = [
      { value: '', label: 'all' },
      { value: 'pending', label: 'pending' },
      { value: 'inProcess', label: 'inProcess' },
      { value: 'finished', label: 'finished' },
    ];
  }

  componentDidMount() {
    this.props.getOrdersAll();
  }

  searchChange = (path, value) => {
    const {
      searchTime,
      searchData,
    } = this.state;

    _.set(searchData, path, value);

    if (searchTime) {
      clearTimeout(searchTime);
    }

    this.setState({
      searchData,
      searchTime: setTimeout(() => {
        this.props.getOrdersAll(searchData);
      }, 200),
    });
  };

  dateChange = (ev) => {
    const {
      searchTime,
      searchData,
    } = this.state;

    const data = new Date(ev);

    const date = moment(data)
      .format('DD MMM YYYY');

    _.set(searchData, 'createdAt', data.toISOString());

    if (searchTime) {
      clearTimeout(searchTime);
    }
    this.setState({
      searchData,
      date,
      searchTime: setTimeout(() => {
        this.props.getOrdersAll(searchData);
      }, 50),
    });
  };

  clearData = () => {
    const {
      searchTime,
      searchData,
    } = this.state;

    const date = moment(new Date())
      .format('DD MMM YYYY');

    _.set(searchData, 'createdAt', '');

    if (searchTime) {
      clearTimeout(searchTime);
    }

    this.setState({
      searchData,
      date,
      searchTime: setTimeout(() => {
        this.props.getOrdersAll(searchData);
      }, 50),
    });
  };

  changeStatus = async (selectedOption) => {
    const { searchData } = this.state;
    _.set(searchData, 'status', selectedOption.value);

    await this.props.getOrdersAll(searchData);

    this.setState({
      status: selectedOption,
      searchData,
    });
  };

  render() {
    const { orders } = this.props;
    const {
      date,
      searchData,
      status,
    } = this.state;

    return (
      <Wrapper>
        <div className="templates">
          <div className="templateBlock">
            <table className="table">
              <thead className="tableHead">
                <tr>
                  <th className="index" />
                  <th>Restaurant Name</th>
                  <th>Restaurant address</th>
                  <th>Phone</th>
                  <th>Ordered at</th>
                  <th>Tables QTY</th>
                  <th>Visibility</th>
                  <th>Start Generate</th>
                  <th>Status</th>
                </tr>
                <tr>
                  <th />
                  <th className="tableInput">
                    <input
                      type="text"
                      name="name"
                      onChange={(ev) => this.searchChange('restaurantName', ev.target.value)}
                    />
                  </th>
                  <th className="tableInput">
                    <input
                      type="text"
                      name="address"
                      onChange={(ev) => this.searchChange('address', ev.target.value)}
                    />
                  </th>
                  <th className="tableInput">
                    <input
                      type="email"
                      name="phone"
                      onChange={(ev) => this.searchChange('phone', ev.target.value)}
                    />
                  </th>
                  <th className="tableInput">
                    <DataPicker
                      change={this.dateChange}
                      date={date}
                      clear={this.clearData}
                    />
                  </th>
                  <th className="tableInput" />
                  <th className="tableInput" />
                  <th className="tableInput" />
                  <th className="tableInput">
                    <Select
                      className="veganSelectBlock"
                      classNamePrefix="vegan"
                      value={status}
                      onChange={this.changeStatus}
                      options={this.status}
                    />
                  </th>
                </tr>
              </thead>
              <tbody className="tableBody">
                {
                _.map(orders, (o, index) => (
                  <TemplatesTr
                    key={o.id}
                    order={o}
                    index={index}
                    searchData={searchData}
                  />
                ))
              }
              </tbody>
            </table>
          </div>
        </div>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  orders: state.orders.orders || {},
  tables: state.table.tables,
  singleOrderOne: state.qr.single_order,
});

const mapDispatchToProps = {
  getBranches,
  getOrdersAll,
  ordering,
  singleOrder,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Templates);

export default Container;
