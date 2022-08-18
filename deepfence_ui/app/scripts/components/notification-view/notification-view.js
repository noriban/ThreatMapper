/*eslint-disable*/

// React imports
import React from 'react';
import { connect } from 'react-redux';

// Custom component imports
import { Navigation } from '../common/navigation';
import AppLoader from "../common/app-loader/app-loader";

import {fetchSystemStatus, markNotificationAsSeen,
} from '../../actions/app-actions';
import { removeUnderscore } from '../../utils/string-utils';
import IntegrationView from "../integration-view/integration-view";
import HeaderView from '../common/header-view/header-view';
const alertColor = { color: '#db2547' };

class NotificationsView extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  updateNotificationSeenStatus() {
    this.props.dispatch(markNotificationAsSeen());
  }

  getSystemStatus() {
    this.props.dispatch(fetchSystemStatus());
  }

  updateNotifications(notifications) {
    this.setState({
      notificationsData: notifications
    })
  }

  getNotificationsLeftpanelView() {
    const {
      hosts=0,
      containers=0
    } = this.props;
    const {
      notificationsData,
    } = this.state;
    const esHealthStatus = {
      width: '10px',
      height: '10px',
      backgroundColor: notificationsData ? notificationsData.elasticsearch_cluster_health.status : 'grey',
      borderRadius: '50%',
      marginLeft: '10px'
    };
    return (
      <div className='notifications-wrapper'>
        <div className="notification-details-wrapper">
          <div className="notification-details-row">
            <div className="notification-details-key">Tracking hosts</div>
            <div className="notification-details-value">
              {hosts} out of {notificationsData.no_of_hosts}
            </div>
          </div>
          <div className="notification-details-row">
            <div className="notification-details-key">Tracking containers</div>
            <div className="notification-details-value">{containers}</div>
          </div>
          <div className="notification-details-row" style={alertColor}>
            <div className="notification-details-key">License expiry date</div>
            <div className="notification-details-value">
              {notificationsData.license_expiry_date}
            </div>
          </div>
          <div className="notification-details-row">
            <div className="notification-details-key">System Health</div>
            <div className="notification-details-value">
              <div style={esHealthStatus}></div>
            </div>
          </div>
          <div className="notification-details-row">
            <div className="notification-details-key">Number of docs</div>
            <div className="notification-details-value">
              {notificationsData.elasticsearch_cluster_health.number_of_docs}
            </div>
          </div>
        </div>
      </div>
    );
  }

  getNotificationRightPanelView() {
    const {
      notificationsData,
    } = this.state;
    return (
      <div>
        <div className='system-status-wrapper'>
 	    <div className={notificationsData.critical_alerts > 0 ? 'system-status-critical-heading' : 'system-status-heading'}>
 		Detected	{notificationsData.critical_alerts}	critical alerts
          </div>
        </div>
      </div>
    );
  }

  getTableView(table) {
    const { systemStatusDetails } = this.props;
    const tableDetails = systemStatusDetails[table];
    const tableKeys = Object.keys(tableDetails);
    return (
      <div className='table-view-wrapper col-md-12 col-lg-12' key={table}>
        <div className='table-heading'>{table} status</div>
        <div className='table-wrapper'>
          { tableKeys && tableKeys.map(tableKey=> this.getTableKeyValuePairView(tableKey, tableDetails) ) }
        </div>
      </div>
    )
  }

  getTableKeyValuePairView(tableKey, tableDetails){
    return (
      <div key={tableKey} className='table-column'>
        <div className='table-key'>{ removeUnderscore(tableKey) }</div>
        <div className='key-value'>{ tableDetails[tableKey] }</div>
      </div>
    )
  }

  getEmptyState(response) {
    let textToBeDisplay;
    if (response) {
      textToBeDisplay = response.error.message;
    }
    return (
      <div>
        { (response == undefined) ? <AppLoader /> : <div className='empty-state-text'>{ textToBeDisplay }</div> }
      </div>
    );
  }

  checkDataAvailability(response) {
    let result = false;
    if (response) {
      if (response.hasOwnProperty('success') && response.success == false) {
        result = false;
      } else {
        result = true;
      }
    } else {
      result = false;
    }
    return result;
  }

  render() {
    const { notificationsData } = this.state;
    const { systemStatusDetails, match } = this.props;

    return (
      <div>
        <Navigation  />
        <div className="protection-polices-view-wrapper"><HeaderView /></div>
        <div className="">
          <div className={`notifications-container ${this.props.isSideNavCollapsed ? 'collapse-side-nav' : 'expand-side-nav'}`}>
            <IntegrationView
            match={match}
            />

          </div>
        </div>


      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isSideNavCollapsed: state.get('isSideNavCollapsed'),
    notificationsResponse: state.get('notificationsResponse'),
    containers: state.get('containers'),
    hosts: state.get('hosts'),
    systemStatusDetails: state.get('systemStatusDetails'),
    isSuccess: state.get('isSuccess'),
    isError: state.get('isError'),
  };
}

export default connect(
  mapStateToProps
)(NotificationsView);
