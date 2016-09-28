import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import TypesMarkup from 'html!markdown!./../../data/overview/types-categorization.md';
import IntegrationMarkup from 'html!markdown!./../../data/overview/integration-presentation.md';
import TablesMarkup from 'html!markdown!./../../data/overview/tables-dictionary.md';

class Overview extends Component {
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
      title: 'Overview',
      returnLink: returnLink,
      activeId: props.location.hash || '#types-categorization'
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
                Overview of AED Data and Tables
              </h2>
            </div>
            <div className="glossary-menu">
              <ul className="glossary-menu__list">
                <li className={this.setMenuItemClass('#types-categorization')}>
                  <a href="#types-categorization">
                    Data Types and Categorization
                  </a>
                </li>
                <li className={this.setMenuItemClass('#integration-presentation')}>
                  <a href="#integration-presentation">
                    Integration and Presentation of Data
                  </a>
                </li>
                <li className={this.setMenuItemClass('#tables-dictionary')}>
                  <a href="#tables-dictionary">
                    AED Tables and Data Dictionary
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="glossary-content">
            <div className="glossary-content__section" id="types-categorization">
              <div dangerouslySetInnerHTML={ { __html: TypesMarkup } } />
            </div>
            <div className="glossary-content__section" id="integration-presentation">
              <div dangerouslySetInnerHTML={ { __html: IntegrationMarkup } } />
            </div>
            <div className="glossary-content__section" id="tables-dictionary">
              <div dangerouslySetInnerHTML={ { __html: TablesMarkup } } />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Overview.propTypes = {
  title: PropTypes.string,
  params: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withRouter(Overview);

