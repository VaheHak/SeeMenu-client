import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DynamicTemplate1 from '../components/DynamicTemplates/DynamicTemplate1';
import DynamicTemplate2 from '../components/DynamicTemplates/DynamicTemplate2';
import ImageEditBlock from '../components/ImageEditBlock';

class EditPage extends Component {
  static propTypes = {
    tableName: PropTypes.object.isRequired,
    restaurantName: PropTypes.object.isRequired,
    tableNameStyle: PropTypes.object.isRequired,
    titleStyle: PropTypes.object.isRequired,
    subTitleStyle: PropTypes.object.isRequired,
    background: PropTypes.object.isRequired,
    tables: PropTypes.object.isRequired,
    restaurantData: PropTypes.object.isRequired,
    order: PropTypes.object.isRequired,
    qrValue: PropTypes.any.isRequired,
    templateNum: PropTypes.number.isRequired,
    viewOrder: PropTypes.bool.isRequired,
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
      order,
      qrValue,
      templateNum,
      viewOrder,
    } = this.props;

    return (
      <div className="edit_page">
        {
          templateNum === 1 ? (
            <DynamicTemplate1
              restaurantName={restaurantName}
              tableNameStyle={tableNameStyle}
              titleStyle={titleStyle}
              subTitleStyle={subTitleStyle}
              background={background}
              restaurantData={restaurantData}
              order={order}
              tables={tables}
              tableName={tableName}
              qrValue={qrValue}
            />
          ) : (
            <DynamicTemplate2
              restaurantName={restaurantName}
              tableNameStyle={tableNameStyle}
              titleStyle={titleStyle}
              subTitleStyle={subTitleStyle}
              background={background}
              restaurantData={restaurantData}
              order={order}
              tableName={tableName}
              qrValue={qrValue}
            />
          )
        }
        {!viewOrder ? (
          <ImageEditBlock />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};
const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditPage);

export default Container;
