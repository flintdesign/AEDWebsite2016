import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Nav from '../components/nav';
import Sidebar from '../components/sidebar';
import TotalCount from '../components/total_count';
import HelpNav from '../components/help_nav';
import { formatNumber } from '../utils/format_utils';

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
    const {
      children,
      location,
      geographies,
      totalEstimate,
      loading,
      dispatch,
      params,
      currentGeography,
      currentGeographyId,
    } = this.props;
    return (
      <div className="container main__container">
        <main className={this.state.showSidebar ? null : 'full-width'}>
          <Nav
            onHandleClick={this.onHandleClick}
            showSidebar={this.state.showSidebar}
          />
          {React.cloneElement(children, {
            currentGeography: currentGeography,
            currentGeographyId: currentGeographyId
          })}
        </main>
        <Sidebar
          location={location}
          showSidebar={this.state.showSidebar}
          geographies={geographies}
          loading={loading}
          dispatch={dispatch}
          countType={location.query.count_type}
          year={parseInt(params.year, 10) || 2013}
          params={params}
          currentGeography={currentGeography}
          currentGeographyId={currentGeographyId}
        />
        {totalEstimate &&
          <TotalCount count={formatNumber(totalEstimate)} />
        }
        <HelpNav location={location} />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  currentGeography: PropTypes.string,
  currentGeographyId: PropTypes.number,
  geographies: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  totalEstimate: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  totalEstimate: state.geographyData.totalEstimate,
  geographies: state.geographyData.geographies,
  loading: state.geographyData.loading,
  currentGeography: state.geographyData.currentGeography,
  currentGeographyId: state.geographyData.currentGeographyId
});

const mapDispatchToProps = (dispatch) => ({ dispatch: dispatch });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
