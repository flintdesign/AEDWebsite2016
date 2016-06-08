import React, { Component, PropTypes } from 'react';
import Nav from '../components/nav';
import Sidebar from '../components/sidebar';
import TotalCount from '../components/total_count';
import HelpNav from '../components/help_nav';

export default class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.onHandleClick = this.onHandleClick.bind(this);
    this.state = {
      showSidebar: false
    };
  }

  onHandleClick() {
    this.setState({
      showSidebar: !this.state.showSidebar
    });
  }

  render() {
    const { children, location } = this.props;
    const isHome = location.pathname === '/';
    const sidebar = isHome ? <Sidebar showSidebar={this.state.showSidebar} /> : null;
    const totalCount = isHome ? <TotalCount /> : null;
    const helpNav = isHome ? <HelpNav location={this.props.location} /> : null;
    return (
      <div className="container main__container">
        <main className={this.state.showSidebar ? null : 'full-width'}>
          <Nav
            onHandleClick={this.onHandleClick}
            showSidebar={this.state.showSidebar}
          />
          {children}
        </main>
        {sidebar}
        {totalCount}
        {helpNav}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired
};
