import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Nav from '../components/nav/nav';
import BreadCrumbNav from '../components/nav/breadcrumb_nav';
import HelpNav from '../components/nav/help_nav';
import Ranges from '../components/ranges';
import Sidebar from '../components/sidebar/sidebar';
import Intro from '../components/pages/intro';
import TotalCount from '../components/total_count';
import { getEntityName, getGeoFromId, flatten } from '../utils/convenience_funcs';
import { formatNumber } from '../utils/format_utils';
import { getCoordData } from '../utils/geo_funcs';
import { fetchGeography, fetchRanges, fetchAdjacentGeography } from '../api';
import {
  toggleSearch,
  toggleLegend,
  expandSidebar,
  setSidebar,
  contractSidebar,
  toggleRange,
  clearAdjacentData,
  updateBounds,
  selectStratum
} from '../actions';

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.expandSidebar = this.expandSidebar.bind(this);
    this.setSidebar = this.setSidebar.bind(this);
    this.contractSidebar = this.contractSidebar.bind(this);
    this.onHandleClick = this.onHandleClick.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleIntroClick = this.handleIntroClick.bind(this);
    this.toggleRange = this.toggleRange.bind(this);
    this.handleLegendClick = this.handleLegendClick.bind(this);
    this.cancelSearch = this.cancelSearch.bind(this);
    this.clearAdjacentData = this.clearAdjacentData.bind(this);
    this.updateBounds = this.updateBounds.bind(this);
    let showIntroOnLoad = true;
    if (props.params.region) {
      showIntroOnLoad = false;
    }
    if (props.location.query.hide_intro) {
      showIntroOnLoad = false;
    }
    this.state = {
      showSidebar: false,
      showIntro: showIntroOnLoad,
      initialLoad: false
    };
  }

  componentDidMount() {
    this.fetchData(this.props, true);
    fetchRanges('known', this.props.dispatch);
    fetchRanges('possible', this.props.dispatch);
    fetchRanges('protected', this.props.dispatch);
    fetchRanges('doubtful', this.props.dispatch);
    if (this.props.location.query.sidebar_state) {
      const requestedState = parseInt(this.props.location.query.sidebar_state, 10);
      this.setSidebar(requestedState);
    } else {
      if (this.props.params.region && this.props.sidebarState === 0) {
        this.expandSidebar();
      }
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.canInput && !this.state.initialLoad && !newProps.loading) {
      this.setState({
        initialLoad: true
      });
    }
    if (newProps.location.query !== this.props.location.query) {
      if (newProps.location.query.count_type !== this.props.location.query.count_type) {
        this.fetchData(newProps, true);
      } else if (newProps.location.pathname !== this.props.location.pathname
        && !newProps.params.stratum) {
        this.fetchData(newProps, true);
      } else {
        this.fetchData(newProps, false);
      }
    }
    if (!this.props.subGeographyData.length &&
      newProps.subGeographyData.length &&
      this.props.params.stratum) {
      this.loadStratumFromGeography(this.props.params.stratum, newProps.subGeographyData);
    }
  }

  onHandleClick() {
    this.setState({
      showSidebar: !this.state.showSidebar
    });
  }

  setSidebar(sideBarState) {
    this.props.dispatch(setSidebar(sideBarState));
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

  clearAdjacentData() {
    this.props.dispatch(clearAdjacentData());
  }

  updateBounds(newBounds) {
    this.props.dispatch(updateBounds(newBounds));
  }

  selectStratum(stratumData) {
    this.props.dispatch(selectStratum(stratumData));
  }

  handleClick(e) {
    const rangeType = e.target.getAttribute('data-range-type');
    fetchRanges(rangeType, this.props.dispatch);
  }

  handleIntroClick() {
    this.setState({
      showIntro: false
    });
  }

  handleLegendClick() {
    this.props.dispatch(toggleLegend());
  }

  loadStratumFromGeography(stratumId, geography) {
    const stratumData = getGeoFromId(stratumId, geography);
    const _coords = stratumData.coordinates.map(flatten);
    const stratumBounds = getCoordData(_coords).bounds;
    this.updateBounds(stratumBounds);
    this.selectStratum(stratumData);
  }

  fetchData(props, force = false) {
    const {
      routeGeography,
      routeGeographyId,
      currentGeography,
      subGeographyData,
      routeYear,
      loading,
      dispatch,
      location,
      params
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

    if (params.country && params.region && !params.stratum) {
      // we looking at a country, grab its surrounding countries inside its region
      fetchAdjacentGeography(
        dispatch,
        'region',
        params.region,
        routeGeography,
        routeGeographyId
      );
    } else if (params.region && !params.country && !params.stratum) {
      // we look at a region, grabs its surrounding regions inside the continent
      fetchAdjacentGeography(
        dispatch,
        'continent',
        'africa',
        routeGeography,
        routeGeographyId
      );
    } else if (params.region && params.country && params.stratum && subGeographyData.length) {
      this.loadStratumFromGeography(params.stratum, subGeographyData);
    } else {
      this.clearAdjacentData();
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
      adjacentData,
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
    let finalTotalConfidence = '';
    if (geographies.summary_sums) {
      finalTotalConfidence = geographies.summary_sums[0].CONFIDENCE;
    }
    let atStratum = false;
    if (selectedStratum) {
      finalTotalEstimate = selectedStratum.estimate;
      finalTotalConfidence = selectedStratum.lcl95;
      atStratum = true;
    }
    const mainClasses = ['main--full', 'main--half', 'main--closed'];
    const searchOverlay = searchActive
      ? <div onClick={this.cancelSearch} className="search__overlay" />
      : null;
    const loadingOverlay = !this.state.initialLoad
      ? <div className="loading-overlay" />
      : <div className="loading-overlay dismissed" />;
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
            searchActive={searchActive}
          />
          {React.cloneElement(children, {
            adjacentData: adjacentData,
            currentGeography: currentGeography,
            currentGeographyId: currentGeographyId,
            parentGeographyData: parentGeographyData,
            subGeographyData: subGeographyData,
            year: routeYear,
            sidebarState: sidebarState,
            openSidebar: this.expandSidebar,
            cancelSearch: this.cancelSearch,
            updateBounds: this.updateBounds,
            bounds: bounds,
            border: border,
            ranges: ranges,
            ui: ui,
            loading: loading,
            canInput,
            routeGeography: routeGeography,
            routeGeographyId: routeGeographyId,
            selectedStratum: selectedStratum,
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
          selectedStratum={selectedStratum}
        />
        {totalEstimate &&
          <TotalCount
            entity={getEntityName(this.props.location)}
            count={formatNumber(finalTotalEstimate)}
            confidence={formatNumber(finalTotalConfidence)}
            canInput={canInput}
            atStratum={atStratum}
            summary={geographies.summary_sums || []}
          />
        }
        <HelpNav location={location} />
        {searchOverlay}
        {loadingOverlay}
        <Intro
          handleIntroClick={this.handleIntroClick}
          showIntro={this.state.showIntro}
        />
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
  adjacentData: PropTypes.array,
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

App.contextTypes = {
  store: React.PropTypes.object
};

const mapStateToProps = (state, props) => {
  // DETERMINE routeGeography FROM PARAMS
  let routeGeography = 'continent';
  if (props.params.country) {
    routeGeography = 'country';
  } else if (props.params.region) {
    routeGeography = 'region';
  }

  // MAP STATE AND PROPS
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
    adjacentData: state.geographyData.adjacentData,
    sidebarState: state.navigation.sidebarState,
    bounds: state.geographyData.bounds,
    border: state.geographyData.border,
    searchActive: state.search.searchActive,
    ranges: state.ranges,
    ui: state.ui,
    selectedStratum: state.geographyData.selectedStratum
  };
};

const mapDispatchToProps = (dispatch) => ({ dispatch: dispatch });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
