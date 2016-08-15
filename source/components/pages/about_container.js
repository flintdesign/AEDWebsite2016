import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';

class AboutContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      title: 'About'
    };
  }
  render() {
    return (
      <div className="about-container">
        <h1>{this.state.title}</h1>
      </div>
    );
  }
}

AboutContainer.propTypes = {
  title: PropTypes.string
};

export default withRouter(AboutContainer);
