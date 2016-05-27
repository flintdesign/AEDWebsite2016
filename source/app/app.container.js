import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Names from '../names/names.container';
import * as NameActions from '../names/names.data';

const App = (props) => {
  const { names, actions } = props;
  return <Names names={names} actions={actions} />;
};

App.propTypes = {
  names: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  names: state.names,
  titles: state.names.map(n => n.title)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(NameActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
