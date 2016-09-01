import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import RangeCategories from 'html!./../../data/glossary/range-categories.html';
import SurveyCategories from 'html!./../../data/glossary/survey-categories.html';
import SurveyReliability from 'html!./../../data/glossary/survey-reliability.html';
import CausesOfChange from 'html!./../../data/glossary/causes-of-change.html';

class Glossary extends Component {
  constructor(props, context) {
    super(props, context);
    this.goBack = this.goBack.bind(this);
    let returnLink = '/?hide_intro=true';
    if (props.location.query.return_to) {
      returnLink = props.location.query.return_to;
    }
    if (props.location.query.sidebar_state) {
      returnLink += `?sidebar_state=${props.location.query.sidebar_state}`;
    }
    this.state = {
      title: 'Glossary',
      returnLink: returnLink,
      activeId: props.location.hash || '#range-categories'
    };
  }

  componentWillUpdate(nextProps) {
    if (nextProps.location.hash !== this.state.activeId) {
      this.setState({
        activeId: nextProps.location.hash
      });
    }
  }

  setMenuItemClass(href) {
    let itemClass = 'glossary-menu__list__item';
    if (href === this.state.activeId) {
      itemClass += ' active';
    }
    return itemClass;
  }

  goBack() {
    this.props.router.push(this.state.returnLink);
  }

  render() {
    return (
      <div>
        <div className="glossary">
          <div className="glossary-sidebar">
            <a onClick={this.goBack} className="glossary-sidebar__close"></a>
            <div className="glossary-sidebar__header">
              <h2 className="glossary-sidebar__header__title">
                Glossary of Terms
              </h2>
            </div>
            <div className="glossary-menu">
              <h4 className="glossary-menu__title">
                DATA TYPES &amp; CATEGORIZATION
              </h4>
              <ul className="glossary-menu__list">
                <li className={this.setMenuItemClass('#range-categories')}>
                  <a href="#range-categories">
                    Range Categories
                  </a>
                </li>
                <li className={this.setMenuItemClass('#survey-categories')}>
                  <a href="#survey-categories">
                    Survey Categories
                  </a>
                </li>
                <li className={this.setMenuItemClass('#survey-reliability')}>
                  <a href="#survey-reliability">
                    Survey Reliability
                  </a>
                </li>
                <li className={this.setMenuItemClass('#reason-for-change')}>
                  <a href="#reason-for-change">
                    Reason for Change
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="glossary-content">
            <div className="glossary-content__section" id="range-categories">
              <div dangerouslySetInnerHTML={ { __html: RangeCategories } } />
            </div>
            <div className="glossary-content__section" id="survey-categories">
              <div dangerouslySetInnerHTML={ { __html: SurveyCategories } } />
            </div>
            <div className="glossary-content__section" id="survey-reliability">
              <div dangerouslySetInnerHTML={ { __html: SurveyReliability } } />
            </div>
            <div className="glossary-content__section" id="reason-for-change">
              <div dangerouslySetInnerHTML={ { __html: CausesOfChange } } />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Glossary.propTypes = {
  title: PropTypes.string,
  params: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withRouter(Glossary);

