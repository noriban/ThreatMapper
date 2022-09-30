/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { setGraphView, setTableView} from '../actions/app-actions';

import {
  GRAPH_VIEW_MODE,
  TABLE_VIEW_MODE,
} from '../constants/naming';

class ViewModeSelector extends React.Component {
  renderItem(label, icon, viewMode, setViewModeAction, isEnabled = true) {
    const isSelected = (this.props.topologyViewMode === viewMode);

    const className = classNames('view-mode-selector-action', {
      'view-mode-selector-action-selected': isSelected,
    });
    const onClick = () => {
      setViewModeAction();
    };

    return (
      <div
        className={className}
        style={{
          backgroundColor: isSelected ? '#242424' : ''
        }}
        disabled={!isEnabled}
        onClick={isEnabled && onClick}
        title={`View ${label.toLowerCase()}`}
        aria-hidden="true">
        {icon}
        {label}
      </div>
    );
  }

  render() {
    return (
      <div className="view-mode-selector">
        <div className="view-mode-selector-wrapper" style={{
          backgroundColor: '#1c1c1c',
        }}>
          {this.renderItem('Graph', <i className="fa fa-th mr-2" aria-hidden="true"/>, GRAPH_VIEW_MODE, this.props.setGraphView)}
          {this.renderItem('Table', <i className="fa fa-table mr-2" aria-hidden="true"/>, TABLE_VIEW_MODE, this.props.setTableView)}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    topologyViewMode: state.get('topologyViewMode'),
    currentTopology: state.get('currentTopology'),
  };
}

export default connect(
  mapStateToProps,
  { setGraphView, setTableView}
)(ViewModeSelector);
