import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import ReactTooltip from 'react-tooltip';

export default class HelpNav extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      active: this.props.location.query.nav === 'true'
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ active: newProps.location.query.nav });
    if (this.props.showIntro && !newProps.showIntro) {
      ReactTooltip.show(findDOMNode(this.refs.helpTrigger));
      setTimeout(() => {
        ReactTooltip.hide(findDOMNode(this.refs.helpTrigger));
      }, 10000);
    }
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
          data-tip
          data-for="helpTriggerTip"
          ref="helpTrigger"
        >
          ?
        </Link>
        <ReactTooltip
          id="helpTriggerTip"
          place="left"
          type="dark"
          effect="solid"
        >
          <span>
            Click to learn more.
          </span>
        </ReactTooltip>
      </div>
    );
  }
}

HelpNav.propTypes = {
  location: PropTypes.object.isRequired,
  showIntro: PropTypes.bool.isRequired
};
