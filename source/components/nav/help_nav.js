import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class HelpNav extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      active: this.props.location.query.nav === 'true'
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ active: newProps.location.query.nav });
  }

  render() {
    const navClassName = `secondary-nav ${this.state.active ? 'active' : 'inactive'}`;
    return (
      <div>
        <div className={navClassName}>
          <Link to="/" className="help-nav__close">&times;</Link>
          <ul>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/resources">Resources</Link>
            </li>
          </ul>
        </div>
        <Link
          to={`/about?return_to=${this.props.location.pathname}`}
          className="help-nav"
        >
          ?
        </Link>
      </div>
    );
  }
}

HelpNav.propTypes = {
  location: PropTypes.object.isRequired,
};
