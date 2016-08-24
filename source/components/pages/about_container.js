import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import aboutData from 'json!./../../data/about.json';
// import Markdown from 'react-remarkable';
import IntroMarkup from 'html!./../../data/about/introduction.html';

class AboutContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      title: 'About',
      activeId: '',
      data: aboutData
    };
  }

  componentDidMount() {
    console.log(this.state.data);
  }

  handleClick(e) {
    console.log(e.target);
  }

  render() {
    return (
      <div>
        <div className="about-title-container">
          <h1>{this.state.title}</h1>
        </div>
        <div className="about-menu">
          <nav>
            <ul>
              {this.state.data.sections.map(section =>
                <li>
                  <a href={`#${section.id}`} onClick={this.handleClick}>
                    {section.title}
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>
        <div className="about-content">
          <div className="about-content__section" id="introduction">
            <div className="about-content__section__content">
              <div dangerouslySetInnerHTML={ { __html: IntroMarkup } }></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AboutContainer.propTypes = {
  title: PropTypes.string
};

export default withRouter(AboutContainer);
