import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import aboutData from 'json!./../../data/about.json';

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
          {this.state.data.sections.map(section =>
            <div className="about-content__section" id={`${section.id}`}>
              <h2 className="about-content__section__title">
                {section.title}
              </h2>
            </div>
          )}
        </div>
      </div>
    );
  }
}

AboutContainer.propTypes = {
  title: PropTypes.string
};

export default withRouter(AboutContainer);
