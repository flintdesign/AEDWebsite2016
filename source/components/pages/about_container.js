import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import IntroMarkup from 'html!./../../data/about/introduction.html';
import PartnersSponsorsMarkup from 'html!./../../data/about/partners-sponsors.html';
import BackgroundHistoryMarkup from 'html!./../../data/about/background-history.html';
import ReportsMarkup from 'html!./../../data/about/reports.html';

class AboutContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.goBack = this.goBack.bind(this);
    let returnLink = '/?hide_intro=true';
    if (props.location.query.return_to) {
      returnLink = `${props.location.query.return_to}?hide_intro=true`;
    }
    this.state = {
      title: 'About',
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
    let itemClass = 'about-menu__item';
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
      <div className="about">
        <div className="about-container">
          <div className="about-sidebar">
            <a onClick={this.goBack} className="about-sidebar__close"></a>
            <div className="about-sidebar__logo"></div>
            <nav className="about-menu">
              <ul>
                <li className={this.setMenuItemClass('#introduction')}>
                  <a href="#introduction">
                    Introduction
                  </a>
                </li>
                <li className={this.setMenuItemClass('#background-history')}>
                  <a href="#background-history">
                    Background &amp; History
                  </a>
                </li>
                <li className={this.setMenuItemClass('#partners-sponsors')}>
                  <a href="#partners-sponsors">
                    Partners &amp; Sponsors
                  </a>
                </li>
                <li className={this.setMenuItemClass('#reports')}>
                  <a href="#reports">
                    Reports &amp; Publications
                  </a>
                </li>
              </ul>
            </nav>
            <div className="about-sidebar__actions">
              <h4>Resources for AED</h4>
              <a className="button" href="/overview?return_to=/about">
                Overview of the AED Data and Tables
              </a>
              <a className="button" href="/glossary?return_to=/about">Glossary of Terms</a>
              <a className="button" href="/aesr-2016">AESR 2016</a>
              <a className="button" href="/references">References</a>
            </div>
          </div>
          <div className="about-content">
            <div className="about-content__section" id="introduction">
              <div className="about-content__section__content">
                <div dangerouslySetInnerHTML={ { __html: IntroMarkup } }></div>
              </div>
            </div>
            <div className="about-content__section" id="background-history">
              <div className="about-content__section__content">
                <div dangerouslySetInnerHTML={ { __html: BackgroundHistoryMarkup } }></div>
              </div>
            </div>
            <div className="about-content__section" id="partners-sponsors">
              <div className="about-content__section__content">
                <div dangerouslySetInnerHTML={ { __html: PartnersSponsorsMarkup } }></div>
              </div>
            </div>
            <div className="about-content__section" id="reports">
              <div className="about-content__section__content">
                <div dangerouslySetInnerHTML={ { __html: ReportsMarkup } }></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AboutContainer.propTypes = {
  title: PropTypes.string,
  params: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withRouter(AboutContainer);
