import React, { Component } from 'react';
import { Close } from '@material-ui/icons';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  deleteCategoryChangeStatus,
} from '../../store/actions/category';
import CategoryCreate from '../Create/CategoryCreate';

class CreateCategoryModal extends Component {
  static propTypes = {
    deleteCategoryChangeStatus: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    categoryProcess: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeLang: 'en',
    };
  }

  changeCategoryLang = async (lang) => {
    await this.props.deleteCategoryChangeStatus();

    this.setState({
      activeLang: lang,
    });
  }

  render() {
    const {
      activeLang,
    } = this.state;

    const {
      categoryProcess,
      close,
    } = this.props;

    return (
      <Modal
        isOpen
        onRequestClose={close}
        overlayClassName="createCategoryModal"
      >
        <div className="createCategory">
          <div className="closeCategoryBlock">
            <span>{categoryProcess}</span>
            <div className="closeButton" onClick={close}>
              <Close />
            </div>
          </div>
          <div className="categoryLanguageBlock">
            <div
              className={activeLang === 'en' ? 'categoryLanguageDiv active' : 'categoryLanguageDiv'}
              onClick={() => this.changeCategoryLang('en')}
            >
              <p>En</p>
            </div>
            <div
              className={activeLang === 'am' ? 'categoryLanguageDiv active' : 'categoryLanguageDiv'}
              onClick={() => this.changeCategoryLang('am')}
            >
              <p>Am</p>
            </div>
            <div
              className={activeLang === 'ru' ? 'categoryLanguageDiv active' : 'categoryLanguageDiv'}
              onClick={() => this.changeCategoryLang('ru')}
            >
              <p>Ru</p>
            </div>
          </div>
          <div className="categoryLanguageBlockRegister">
            {activeLang === 'en'
              ? (
                <CategoryCreate
                  label="Category Name"
                  categoryImage="Category image"
                  button="Save"
                  success="Category is save."
                  lang="En"
                />
              )
              : null}
            {activeLang === 'ru'
              ? (
                <CategoryCreate
                  label="Название категории"
                  categoryImage="Изображение категории"
                  button="Сохранить"
                  success="Категория сохранено."
                  lang="Ru"
                />
              )
              : null}
            {activeLang === 'am'
              ? (
                <CategoryCreate
                  label="Կատեգորիայի անվանումը"
                  categoryImage="Կատեգորիայի պատկեր"
                  button="Պահպանել"
                  success="Կատեգորիան պահպանված է:"
                  lang="Am"
                />
              )
              : null}
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  deleteCategoryChangeStatus,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateCategoryModal);

export default withRouter(Container);
