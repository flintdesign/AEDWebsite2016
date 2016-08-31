import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import IntroMarkup from 'html!./../../data/about/introduction.html';
import AboutUsMarkup from 'html!./../../data/about/about-us.html';
import PartnersResourcesMarkup from 'html!./../../data/about/partners-resources.html';
import KeyPointsMarkup from 'html!./../../data/about/key-points.html';
import ReportsMarkup from 'html!./../../data/about/reports.html';

class AboutContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      title: 'About',
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

  render() {
    return (
      <div className="about">
        <div className="about-container">
          <div className="about-sidebar">
            <a href="/?hide_intro=true" className="about-sidebar__close"></a>
            <div className="about-sidebar__logo"></div>
            <nav className="about-menu">
              <ul>
                <li className={this.setMenuItemClass('#introduction')}>
                  <a href="#introduction">
                    Introduction
                  </a>
                </li>
                <li className={this.setMenuItemClass('#about-us')}>
                  <a href="#about-us">
                    About Us
                  </a>
                </li>
                <li className={this.setMenuItemClass('#partners-resources')}>
                  <a href="#partners-resources">
                    Partners &amp; Resources
                  </a>
                </li>
                <li className={this.setMenuItemClass('#key-points')}>
                  <a href="#key-points">
                    Key Points
                  </a>
                </li>
                <li className={this.setMenuItemClass('#reports')}>
                  <a href="#reports">
                    Reports
                  </a>
                </li>
              </ul>
            </nav>
            <div className="about-sidebar__actions">
              <h4>Resources for AED</h4>
              <a className="button" href="/glossary">Glossary of Terms</a>
            </div>
          </div>
          <div className="about-content">
            <div className="about-content__section" id="introduction">
              <div className="about-content__section__content">
                <div dangerouslySetInnerHTML={ { __html: IntroMarkup } }></div>
              </div>
            </div>
            <div className="about-content__section" id="about-us">
              <div className="about-content__section__content">
                <div dangerouslySetInnerHTML={ { __html: AboutUsMarkup } }></div>
              </div>
            </div>
            <div className="about-content__section" id="partners-resources">
              <div className="about-content__section__content">
                <div dangerouslySetInnerHTML={ { __html: PartnersResourcesMarkup } }></div>
              </div>
            </div>
            <div className="about-content__section" id="key-points">
              <div className="about-content__section__content">
                <div dangerouslySetInnerHTML={ { __html: KeyPointsMarkup } }></div>
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
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    hash: PropTypes.string
  }),
};

export default withRouter(AboutContainer);
