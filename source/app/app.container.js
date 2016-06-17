import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Nav from '../components/nav';
import Sidebar from '../components/sidebar';
import TotalCount from '../components/total_count';
import HelpNav from '../components/help_nav';
import { fetchRegionData } from '../actions/app_actions';

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
    const { children, location, onVizTypeChange, regionData } = this.props;
    const isHome = location.pathname === '/';
    let sidebar;
    let totalCount;
    let helpNav;
    if (isHome) {
      sidebar = (<Sidebar
        location={location}
        showSidebar={this.state.showSidebar}
        vizTypeChange={onVizTypeChange}
        regionData={regionData}
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
  onVizTypeChange: PropTypes.func.isRequired,
  regionData: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({ regionData: state.regionData });

const mapDispatchToProps = (dispatch) => ({
  onVizTypeChange: () => dispatch(fetchRegionData)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
