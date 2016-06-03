import React, { Component } from 'react';
import { Link } from 'react-router';

export default class HelpNav extends Component {
  constructor(props, context) {
    super(props, context);
    this.toggleActiveClass = this.toggleActiveClass.bind(this);
    this.state = {
      active: false
    };
  }

  toggleActiveClass() {
    this.setState({ active: !this.state.active });
  }

  render() {
    const navClassName = `secondary-nav ${this.state.active ? 'active' : 'inactive'}`;
    return (
      <div>
        <div className={navClassName}>
          <span onClick={this.toggleActiveClass} className="help-nav__close">&times;</span>
          <ul>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/resources">Resources</Link>
            </li>
          </ul>
        </div>
        <div
          onClick={this.toggleActiveClass}
          className="help-nav"
        >
          ?
        </div>
      </div>
    );
  }
}
