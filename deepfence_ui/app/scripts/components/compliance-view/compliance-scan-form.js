/* eslint-disable camelcase */
import React from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field, formValueSelector} from 'redux-form/immutable';
import {Map} from 'immutable';
import Loader from '../common/app-loader/horizontal-dots-loader';
import {
  clearScanComplianceBulkAction,
} from '../../actions/app-actions';
import ToggleSwitchField from '../common/toggle-switch/redux-form-field';
import { checkTypes } from './start-scan-modal';

const renderCheckboxGroupField = ({input, meta, options}) => {
  const {name, onChange} = input;
  const {touched, error} = meta;
  const inputValue = input.value;

  const checkboxes = options.map(({displayName, id, disabled}, index) => {
    const handleChange = (event) => {
      const arr = [...inputValue];
      if (event.target.checked) {
        arr.push(id);
      } else {
        arr.splice(arr.indexOf(id), 1);
      }
      return onChange(arr);
    };
    const checked = inputValue.includes(id);
    return (
      <div className="df-checkbox-button" key={displayName}>
        <input
          type="checkbox"
          name={`${name}[${index}]`}
          id={`${name}[${index}]`}
          value={id}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
        />
        <label htmlFor={`${name}[${index}]`}>
          <span>{displayName}</span>
        </label>
      </div>
    );
  });

  return (
    <div>
      <div className="df-checkbox-group">{checkboxes}</div>
      {touched && error && <p className="error">{error}</p>}
    </div>
  );
};

class ComplianceScanTypeForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.submitClickHandler = this.submitClickHandler.bind(this);
  }

  componentDidMount() {
    const {
      clearScanComplianceBulkAction: clearAction,
    } = this.props;
    clearAction();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const {
      change,
      toggleAll,
    } = this.props;
    if (toggleAll !== newProps.toggleAll) {
      if (newProps.toggleAll) {
        change('scanType', checkTypes[this.props.cloudType].map(el => el.id));
      } else {
        change('scanType', [])
      }
    }
  }

  submitClickHandler(values) {
    const {handleSubmit} = this.props;
    return handleSubmit(values);
  }

  toggleState() {
    const { showAdvancedOptions } = this.state;
    this.setState(
      {
        showAdvancedOptions: !showAdvancedOptions
      },
    );
  }

  render() {
    const {
      submitting,
      loading = false,
      message,
      errorMessage,
      scheduleInterval,
    } = this.props;

    const scanButtonLabel = scheduleInterval?.length ? 'Schedule Scan' : 'Scan Now';
    return (
      <div className="node-cve">
        <div className="cve-scan-form">
          <div className="title">
            Start a new scan
          </div>
          <form onSubmit={this.submitClickHandler} autoComplete="off">
            <Field
              name="toggle"
              component={ToggleSwitchField}
              label="Select All"
            />
            <Field
              component={renderCheckboxGroupField}
              options={checkTypes[this.props.cloudType]}
              name="scanType"
            />
            <div className="form-field">
              <span className="label">
                Scan Interval in days (optional)
              </span>
              <Field
                component="input"
                type="text"
                name="scheduleInterval"
              />
            </div>
            <div className="form-field">
              <button
                className="primary-btn full-width relative"
                type="submit"
                disabled={submitting}
               >
                {scanButtonLabel}
              </button>
              {loading && <Loader style={{ right: '4%', top: '0%'}} />}
            </div>
            <div>
              {message
                && (
                <span className="message">
                  {message}
                </span>
                )
              }
              {errorMessage
                && (
                <span className="error-message">
                  {errorMessage}
                </span>
                )
              }
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const compScanFormSelector = formValueSelector('comp-scan');
const mapStateToProps = state => ({
  lloading: state.getIn(['scan_compliance_bulk', 'loading']),
  errorMessage: state.getIn(['scan_compliance_bulk', 'error', 'message']),
  message: state.getIn(['scan_compliance_bulk', 'message']),
  toggleAll: compScanFormSelector(state, 'toggle'),
  scheduleInterval: compScanFormSelector(state, 'scheduleInterval'),
});

export default reduxForm({
  form: 'comp-scan',
  initialValues: Map({
    scanType: [],
  }),
})(connect(mapStateToProps, {
  clearScanComplianceBulkAction,
})(ComplianceScanTypeForm));