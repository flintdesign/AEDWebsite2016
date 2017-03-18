import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import Introduction from 'html!markdown!./../../data/aesr-2016/introduction.md';
import ExecutiveSummary from 'html!markdown!./../../data/aesr-2016/executive-summary.md';
import Errata2016 from 'html!markdown!./../../data/aesr-2016/errata-2016.md';

class aesr2016 extends Component {
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
      title: 'AESR 2016',
      returnLink: returnLink,
      activeId: props.location.hash || '#introduction'
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
    this.props.router.push('/about');
  }

  render() {
    return (
      <div>
        <div className="glossary glossary--aesr-2016">
          <div className="glossary-sidebar">
            <a onClick={this.goBack} className="glossary-sidebar__close"></a>
            <div className="glossary-sidebar__header">
              <h2 className="glossary-sidebar__header__title">
                AESR 2016
              </h2>
            </div>
            <div className="glossary-menu">
              <h4 className="glossary-menu__title">
                AESR 2016
              </h4>
              <ul className="glossary-menu__list">
                <li className={this.setMenuItemClass('#introduction')}>
                  <a href="#introduction">
                    Introduction
                  </a>
                </li>
                <li className={this.setMenuItemClass('#executive-summary')}>
                  <a href="#executive-summary">
                    Executive Summary
                  </a>
                </li>
                <li className={this.setMenuItemClass('#errata-2016')}>
                  <a href="#errata-2016">
                    Errata 2016
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="about-content">
            <div className="about-content__section" id="introduction">
              <div dangerouslySetInnerHTML={ { __html: Introduction } } />
            </div>
            <div className="about-content__section" id="executive-summary">
              <div dangerouslySetInnerHTML={ { __html: ExecutiveSummary } } />
            </div>
            <div className="about-content__section" id="errata-2016">
              <div dangerouslySetInnerHTML={ { __html: Errata2016 } } />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

aesr2016.propTypes = {
  title: PropTypes.string,
  params: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withRouter(aesr2016);

