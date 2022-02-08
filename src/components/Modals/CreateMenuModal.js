import React, { Component } from 'react';
import { Close } from '@material-ui/icons';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  deleteMenuChangeStatus,
} from '../../store/actions/menu';
import MenuCreate from '../Create/MenuCreate';

class CreateMenuModal extends Component {
  static propTypes = {
    deleteMenuChangeStatus: PropTypes.func.isRequired,
    menuProcess: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
    categoryId: PropTypes.any.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeLang: 'en',
    };
  }

  changeMenuLang = async (lang) => {
    await this.props.deleteMenuChangeStatus();

    this.setState({
      activeLang: lang,
    });
  }

  render() {
    const {
      close,
      menuProcess,
      categoryId,
    } = this.props;

    const {
      activeLang,
    } = this.state;

    return (
      <>
        <Modal
          isOpen
          onRequestClose={() => close(categoryId)}
          overlayClassName="createMenuModal"
        >
          <div className="createMenu">
            <div className="closeCategoryBlock">
              <span>{menuProcess}</span>
              <div className="closeButton" onClick={() => close(categoryId)}>
                <Close />
              </div>
            </div>
            <div className="categoryLanguageBlock">
              <div
                className={activeLang === 'en' ? 'categoryLanguageDiv active' : 'categoryLanguageDiv'}
                onClick={() => this.changeMenuLang('en')}
              >
                <p>En</p>
              </div>
              <div
                className={activeLang === 'am' ? 'categoryLanguageDiv active' : 'categoryLanguageDiv'}
                onClick={() => this.changeMenuLang('am')}
              >
                <p>Am</p>
              </div>
              <div
                className={activeLang === 'ru' ? 'categoryLanguageDiv active' : 'categoryLanguageDiv'}
                onClick={() => this.changeMenuLang('ru')}
              >
                <p>Ru</p>
              </div>
            </div>
            <div className="categoryLanguageBlockRegister">
              {activeLang === 'en'
                ? (
                  <MenuCreate
                    productName="Product name"
                    productPrice="Price"
                    productDetail="Product detail"
                    lang="En"
                    menuImage="Product image"
                    button="Save"
                    success="Product is save."
                    categoryId={categoryId}
                  />
                )
                : null}
              {activeLang === 'am'
                ? (
                  <MenuCreate
                    productName="Պրոդուկտի անվանումը"
                    productPrice="Գին"
                    productDetail="Պրոդուկտի նկարագրություն"
                    lang="Am"
                    menuImage="Պրոդուկտի պատկեր"
                    button="Պահպանել"
                    success="Պրոդուկտը պահպանված է:"
                    categoryId={categoryId}
                  />
                )
                : null}
              {activeLang === 'ru'
                ? (
                  <MenuCreate
                    productName="Название продукта"
                    productPrice="Цена"
                    productDetail="Информация продукта"
                    lang="Ru"
                    menuImage="Изображение продукта"
                    button="Сохранить"
                    success="Продукт сохранен"
                    categoryId={categoryId}
                  />
                )
                : null}
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  menuData: state.menu.menuData,
});

const mapDispatchToProps = {
  deleteMenuChangeStatus,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateMenuModal);

export default withRouter(Container);
