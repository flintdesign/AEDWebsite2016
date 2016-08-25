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
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      title: 'About',
      activeId: '#introduction'
    };
  }

  componentDidMount() {
  }

  handleClick() {
    console.log(this.props.params);
  }

  render() {
    return (
      <div className="about">
        <div className="about-container">
          <div className="about-sidebar">
            <div className="about-sidebar__logo"></div>
            <nav className="about-menu">
              <ul>
                <li className={'about-menu__item'}>
                  <a href="#introduction" onClick={this.handleClick}>
                    Introduction
                  </a>
                </li>
                <li className="about-menu__item">
                  <a href="#about-us" onClick={this.handleClick}>
                    About Us
                  </a>
                </li>
                <li className="about-menu__item">
                  <a href="#partners-resources" onClick={this.handleClick}>
                    Partners &amp; Resources
                  </a>
                </li>
                <li className="about-menu__item">
                  <a href="#key-points" onClick={this.handleClick}>
                    Key Points
                  </a>
                </li>
                <li className="about-menu__item">
                  <a href="#reports" onClick={this.handleClick}>
                    Reports
                  </a>
                </li>
              </ul>
            </nav>
            <div className="about-sidebar__actions">
              <h4>Resources for AED</h4>
              <button href="/resources">Glossary of Terms</button>
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
