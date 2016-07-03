import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Nav from '../components/nav';
import BreadCrumbNav from '../components/breadcrumb_nav';
import Sidebar from '../components/sidebar';
import TotalCount from '../components/total_count';
import HelpNav from '../components/help_nav';
import { getEntityName } from '../utils/convenience_funcs';
import { formatNumber } from '../utils/format_utils';
import { fetchGeography } from '../api';
import { toggleSearch, expandSidebar, contractSidebar } from '../actions';

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.expandSidebar = this.expandSidebar.bind(this);
    this.contractSidebar = this.contractSidebar.bind(this);
    this.fetchData(props, true);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps);
  }
  expandSidebar() {
    this.props.dispatch(expandSidebar());
  }
  contractSidebar() {
    this.props.dispatch(contractSidebar());
  }

  cancelSearch() {
    this.props.dispatch(toggleSearch(false));
  }

  fetchData(props, force = false) {
    const {
      routeGeography,
      routeGeographyId,
      currentGeography,
      routeYear,
      loading,
      dispatch
    } = props;

    if (force || (routeGeography !== currentGeography && !loading)) {
      fetchGeography(dispatch, routeGeography, routeGeographyId, routeYear, null);
    }
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
      subGeographyData,
      routeYear,
      sidebarState,
    } = this.props;

    const mainClasses = ['main--full', 'main--half', 'main--closed'];

    return (
      <div className={
        `container main__container
        sidebar--${(sidebarState > 0 ? 'open' : 'closed')}
        ${(!params.region ? '' : 'breadcrumbs-active')}`}
      >
        <main className={mainClasses[sidebarState]}>
          <BreadCrumbNav params={this.props.params} />
          <Nav
            expandSidebar={this.expandSidebar}
            contractSidebar={this.contractSidebar}
            sidebarState={sidebarState}
            onHandleClick={this.toggleSidebar}
          />
          {React.cloneElement(children, {
            currentGeography: currentGeography,
            currentGeographyId: currentGeographyId,
            subGeographyData: subGeographyData,
            year: routeYear,
            openSidebar: this.expandSidebar,
            cancelSearch: this.cancelSearch.bind(this)
          })}
        </main>
        <Sidebar
          location={location}
          sidebarState={sidebarState}
          geographies={geographies}
          loading={loading}
          dispatch={dispatch}
          countType={location.query.count_type}
          year={routeYear}
          params={params}
          currentGeography={currentGeography}
          currentGeographyId={currentGeographyId}
        />
        {totalEstimate &&
          <TotalCount
            entity={getEntityName(this.props.location)}
            count={formatNumber(totalEstimate)}
          />
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
  currentGeographyId: PropTypes.string,
  geographies: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  totalEstimate: PropTypes.string.isRequired,
  routeGeography: PropTypes.string,
  routeGeographyId: PropTypes.string,
  routeYear: PropTypes.string,
  subGeographyData: PropTypes.array,
  sidebarState: PropTypes.number,
};

const mapStateToProps = (state, props) => {
  let routeGeography = 'continent';
  if (props.params.country) {
    routeGeography = 'country';
  } else if (props.params.region) {
    routeGeography = 'region';
  }
  return {
    totalEstimate: state.geographyData.totalEstimate,
    geographies: state.geographyData.geographies,
    loading: state.geographyData.loading,
    currentGeography: state.geographyData.currentGeography,
    currentGeographyId: state.geographyData.currentGeographyId,
    routeGeography: routeGeography,
    routeGeographyId: props.params[routeGeography] || 'africa',
    routeYear: props.params.year || '2013',
    subGeographyData: state.geographyData.subGeographies,
    sidebarState: state.navigation.sidebarState,
  };
};

const mapDispatchToProps = (dispatch) => ({ dispatch: dispatch });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
