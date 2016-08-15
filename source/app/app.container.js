import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Nav from '../components/nav/nav';
import BreadCrumbNav from '../components/nav/breadcrumb_nav';
import HelpNav from '../components/nav/help_nav';
import Ranges from '../components/ranges';
import Sidebar from '../components/sidebar/sidebar';
import TotalCount from '../components/total_count';
import { getEntityName, getGeoFromId, flatten } from '../utils/convenience_funcs';
import { formatNumber } from '../utils/format_utils';
import { getCoordData } from '../utils/geo_funcs';
import { fetchGeography, fetchRanges } from '../api';
import {
  toggleSearch,
  toggleLegend,
  expandSidebar,
  contractSidebar,
  toggleRange
} from '../actions';

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.expandSidebar = this.expandSidebar.bind(this);
    this.contractSidebar = this.contractSidebar.bind(this);
    this.onHandleClick = this.onHandleClick.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.toggleRange = this.toggleRange.bind(this);
    this.handleLegendClick = this.handleLegendClick.bind(this);
    this.cancelSearch = this.cancelSearch.bind(this);
    this.state = {
      showSidebar: false
    };
  }

  componentDidMount() {
    this.fetchData(this.props, true);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.location.query !== this.props.location.query) {
      this.fetchData(newProps, false);
    }
  }

  onHandleClick() {
    this.setState({
      showSidebar: !this.state.showSidebar
    });
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

  toggleRange(rangeType) {
    this.props.dispatch(toggleRange(rangeType));
  }

  handleClick(e) {
    const rangeType = e.target.getAttribute('data-range-type');
    fetchRanges(rangeType, this.props.dispatch);
  }

  handleLegendClick() {
    this.props.dispatch(toggleLegend());
  }

  fetchData(props, force = false) {
    const {
      routeGeography,
      routeGeographyId,
      currentGeography,
      routeYear,
      loading,
      dispatch,
      location
    } = props;

    if (force || (routeGeography !== currentGeography && !loading)) {
      fetchGeography(
        dispatch,
        routeGeography,
        routeGeographyId,
        routeYear,
        location.query.count_type
      );
    }
  }

  render() {
    const {
      children,
      location,
      geographies,
      totalEstimate,
      loading,
      canInput,
      dispatch,
      params,
      currentGeography,
      currentGeographyId,
      currentNarrative,
      parentGeographyData,
      subGeographyData,
      routeYear,
      sidebarState,
      error,
      bounds,
      border,
      searchActive,
      ranges,
      ui,
      routeGeography,
      routeGeographyId,
      selectedStratum
    } = this.props;
    let finalTotalEstimate = totalEstimate;
    if (selectedStratum) {
      if (selectedStratum.data) {
        finalTotalEstimate = selectedStratum.data.estimate;
      }
    }
    const mainClasses = ['main--full', 'main--half', 'main--closed'];
    const searchOverlay = searchActive
      ? <div onClick={this.cancelSearch} className="search__overlay" />
      : null;
    return (
      <div
        className={
          `container main__container
          sidebar--${(sidebarState > 0 ? 'open' : 'closed')}
          ${(!params.region ? '' : 'breadcrumbs-active')}`}
        onClick={toggleSearch}
      >
        <main className={mainClasses[sidebarState]}>
          <Ranges
            handleClick={this.handleClick}
            handleLegendClick={this.handleLegendClick}
            toggleRange={this.toggleRange}
            ui={ui}
          />
          <BreadCrumbNav params={this.props.params} />
          <Nav
            expandSidebar={this.expandSidebar}
            contractSidebar={this.contractSidebar}
            sidebarState={sidebarState}
            onHandleClick={this.toggleSidebar}
            params={this.props.params}
            loading={loading}
          />
          {React.cloneElement(children, {
            currentGeography: currentGeography,
            currentGeographyId: currentGeographyId,
            parentGeographyData: parentGeographyData,
            subGeographyData: subGeographyData,
            year: routeYear,
            sidebarState: sidebarState,
            openSidebar: this.expandSidebar,
            cancelSearch: this.cancelSearch,
            bounds: bounds,
            border: border,
            ranges: ranges,
            ui: ui,
            loading: loading,
            canInput,
            routeGeography: routeGeography,
            routeGeographyId: routeGeographyId,
            dispatch: dispatch
          })}
        </main>
        <Sidebar
          error={error}
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
          currentNarrative={currentNarrative}
          canInput={canInput}
        />
        {totalEstimate && canInput &&
          <TotalCount
            entity={getEntityName(this.props.location)}
            count={formatNumber(finalTotalEstimate)}
          />
        }
        <HelpNav location={location} />
        {searchOverlay}
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
  currentNarrative: PropTypes.string,
  geographies: PropTypes.object,
  loading: PropTypes.bool,
  canInput: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  totalEstimate: PropTypes.string,
  routeGeography: PropTypes.string,
  routeGeographyId: PropTypes.string,
  routeYear: PropTypes.string,
  parentGeographyData: PropTypes.array,
  subGeographyData: PropTypes.array,
  sidebarState: PropTypes.number,
  error: PropTypes.string,
  bounds: PropTypes.array,
  border: PropTypes.object,
  searchActive: PropTypes.bool.isRequired,
  ranges: PropTypes.object,
  ui: PropTypes.object,
  selectedStratum: PropTypes.object
};

const mapStateToProps = (state, props) => {
  let routeGeography = 'continent';
  if (props.params.country) {
    routeGeography = 'country';
  } else if (props.params.region) {
    routeGeography = 'region';
  }
  let finalBounds = state.geographyData.bounds;
  let selectedStratum = null;
  if (props.params.stratum) {
    const stratumId = props.params.stratum;
    const geosData = state.geographyData.subGeographies;
    selectedStratum = {
      data: getGeoFromId(stratumId, geosData)
    };
    const _coords = selectedStratum.data.coordinates.map(flatten);
    finalBounds = getCoordData(_coords).bounds;
  }

  return {
    error: state.geographyData.error,
    totalEstimate: state.geographyData.totalEstimate,
    geographies: state.geographyData.geographies,
    loading: state.geographyData.loading,
    canInput: state.geographyData.canInput,
    currentGeography: state.geographyData.currentGeography,
    currentGeographyId: state.geographyData.currentGeographyId,
    currentNarrative: state.geographyData.currentNarrative,
    routeGeography: routeGeography,
    routeGeographyId: props.params[routeGeography] || 'africa',
    routeYear: props.params.year || '2013',
    parentGeographyData: state.geographyData.parentGeography,
    subGeographyData: state.geographyData.subGeographies,
    sidebarState: state.navigation.sidebarState,
    bounds: finalBounds,
    border: state.geographyData.border,
    searchActive: state.search.searchActive,
    ranges: state.ranges,
    ui: state.ui,
    selectedStratum: selectedStratum
  };
};

const mapDispatchToProps = (dispatch) => ({ dispatch: dispatch });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
