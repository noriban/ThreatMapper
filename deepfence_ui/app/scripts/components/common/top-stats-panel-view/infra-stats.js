// TODO: THIS IS WIP
/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Tippy from '@tippyjs/react';
import {
  fetchTopologyMetrics, noIntegrationComponentChange,
} from '../../../actions/app-actions';
import pollable from '../header-view/pollable';
import DROPDOWN_IMAGE from '../../../../images/dropdown.svg';
import { simplePluralize } from '../../../utils/string-utils';

const INFRA_MAP = {
  'Cloud Providers': 'CP',
  'Containers': 'CT',
  'Container Images': 'CI',
  'Hosts': 'HS',
  'Kubernetes': 'KB',
  'Namespaces': 'NS',
  'pods': 'PD'
}

const colors = ['#709ee4', '#138c6c', '#f1c847', '#e26c60', '#bb9cf8', '#6f2ff5']

const getKey = (key) => {
  const keyMapping = {
    cloud_provider: 'CSPs',
    container_image: 'Images',
    kubernetes_cluster: 'Kubernetes',
    kubernetes_namespace: 'Namespaces',
  };

  return keyMapping[key] || simplePluralize(key);
};

const renderGroup = group => (
  <div className="infra-stats-group" style={{
  }}>
    {Object.entries(group).map(([key, value], i) => (
      <div key={key} className="infra-item">
        <div className="name" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent:'center',
          gap: '4px'
        }}>
          <Tippy content={getKey(key)} 
            placement="bottom">
            <div style={{display: 'flex'}}>
              <i className='fa fa-amazon' style={{
                  background: colors[i],
                  padding: '4px',
                  borderRadius: '50%',
              }}/>
              
              <div className="count" style={{
                paddingRight: '6px',
                paddingLeft: '2px',
                fontWeight: 'bold'
              }}>
                {value}
              </div>
            </div>
          </Tippy>
        </div>
      </div>
    ))}
  </div>
);

class InfraStats extends React.Component {
  constructor(props) {
    super(props);
    const activeMenuItem = localStorage.getItem('selectedMenuItem');
    this.state = {
      selectedMenuItem: activeMenuItem || 'Topology'
    };
    this.fetchCounts = this.fetchCounts.bind(this);
    this.renderIntegration = this.renderIntegration.bind(this);
    this.goBackToIntegrations = this.goBackToIntegrations.bind(this);
  }

  goBackToIntegrations() {
    this.props.dispatch(noIntegrationComponentChange());
  }

  componentDidMount() {
    const {registerPolling, startPolling} = this.props;
    registerPolling(this.fetchCounts);
    startPolling();
  }

  fetchCounts() {
    const {
      fetchTopologyMetrics: action,
    } = this.props;
    return action();
  }

  renderIntegration() {
    if (window.location.hash === '#/notification') {
      return (
        <div className="dashbord-link" onClick={this.goBackToIntegrations} style={{cursor: 'pointer'}} aria-hidden="true">
          {this.props.changeIntegration ? (<span className="dashboard-breadcrumb" style={{marginRight: '2px', color: '#007BFF'}}> Integrations</span>) : (<span>Integrations</span>)}
          {this.props.changeIntegration && <img src={DROPDOWN_IMAGE} alt="breadcrumb" style={{marginRight: '2px'}} />}
          {this.props.integrationName}
        </div>
      );
    }
    return (
      <div className="dashbord-link">
        {this.props.breadcrumb && this.props.breadcrumb.map(el => (el.link ? (
          <div style={{display: 'inline'}} key={el.id}>
            <span className="dashboard-breadcrumb" style={{marginRight: '2px'}} key={el.id}>
              <Link to={el.link} replace>
                {el.name}
                {' '}
              </Link>
            </span>
            <img src={DROPDOWN_IMAGE} alt="breadcrumb" style={{marginRight: '2px'}} />
          </div>
        ) : (
          <span>
            {' '}
            {el.name}
            {' '}
          </span>
        )))}
      </div>
    );
  }

  render() {
    const {
      infraStats = {}
    } = this.props;
    if (infraStats?.coverage?.discovered === infraStats?.coverage?.protected) {
      // delete coverage from infraStats
      delete infraStats.coverage;
    }

    return (
      <div className="metrics-wrapper">
        {Object.entries(infraStats).map(([key, value]) => (
          <div className="infra-stats" key={key}>
            {renderGroup(value)}
          </div>
        ))
        }
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    containers: state.get('containers'),
    hosts: state.get('hosts'),
    pods: state.get('pods'),
    kubeClusters: state.get('kube_clusters'),
    searchQuery: state.get('globalSearchQuery'),
    days: state.get('alertPanelHistoryBound'),
    globalSearchQuery: state.get('globalSearchQuery') || [],
    refreshInterval: state.get('refreshInterval'),
    breadcrumb: state.get('breadcrumb'),
    integrationName: state.get('integrationName'),
    changeIntegration: state.get('changeIntegration'),
    infraStats: state.get('topologyMetrics'),
    historyBound: state.get('alertPanelHistoryBound'),
    isFiltersViewVisible: state.get('isFiltersViewVisible')
  };
}
export default connect(
  mapStateToProps, {
    fetchTopologyMetrics,
  }
)(pollable()(InfraStats));
