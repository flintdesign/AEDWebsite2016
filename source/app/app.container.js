import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Nav from '../components/nav';
import Sidebar from '../components/sidebar';
import TotalCount from '../components/total_count';
import HelpNav from '../components/help_nav';

class App extends Component {
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
    const { children, location, regions, loading, dispatch } = this.props;
    const isHome = location.pathname === '/';
    let sidebar;
    let totalCount;
    let helpNav;
    if (isHome) {
      sidebar = (<Sidebar
        location={location}
        showSidebar={this.state.showSidebar}
        regions={regions}
        loading={loading}
        dispatch={dispatch}
      />);
      totalCount = <TotalCount />;
      helpNav = <HelpNav location={this.props.location} />;
    }
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
  params: PropTypes.object.isRequired,
  regions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  regions: state.regionData.regions,
  loading: state.regionData.loading
});

const mapDispatchToProps = (dispatch) => ({ dispatch: dispatch });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
