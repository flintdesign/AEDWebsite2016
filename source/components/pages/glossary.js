import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import GlossaryToggleItem from './glossary_toggle';
import RangeCategories from 'html!./../../data/glossary/range-categories.html';
import SurveyCategoriesIntro from 'html!./../../data/glossary/survey-categories.html';
import SurveyReliabilityContent from 'html!./../../data/glossary/survey-categories-2.html';
import SurveyCategoriesToggle from 'json!./../../data/glossary/survey-categories-toggle-list.json';
import CausesOfChangeIntro from 'html!./../../data/glossary/causes-of-change.html';
import CausesOfChangeToggle from 'json!./../../data/glossary/causes-of-change-toggle-list.json';

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
              <div className="survey-categories">
                <div dangerouslySetInnerHTML={ { __html: SurveyCategoriesIntro } } />
                <div className="glossary-content__section__inner">
                  <ul className="glossary-toggle-list">
                    {SurveyCategoriesToggle.data.map((item, i) => (
                      <GlossaryToggleItem
                        key={`survery-cat-toggle-${i}`}
                        abbrv={item.abbrv}
                        headerTitle={item.headerTitle}
                        content={item.content}
                      />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="glossary-content__section" id="survey-reliability">
              <div className="survey-reliability">
                <div dangerouslySetInnerHTML={ { __html: SurveyReliabilityContent } } />
              </div>
            </div>
            <div className="glossary-content__section" id="reason-for-change">
              <div className="causes-of-change">
                <div dangerouslySetInnerHTML={ { __html: CausesOfChangeIntro } } />
                <div className="glossary-content__section__inner">
                  <ul className="glossary-toggle-list">
                    {CausesOfChangeToggle.data.map((item, i) => (
                      <GlossaryToggleItem
                        key={`cause-toggle-${i}`}
                        abbrv={item.abbrv}
                        headerTitle={item.headerTitle}
                        content={item.content}
                      />
                    ))}
                  </ul>
                </div>
              </div>
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

