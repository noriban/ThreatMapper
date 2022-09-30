import React from 'react';
import Select from 'react-select';
import './styles.scss';

export const SingleSelectDropdown = (props) => {
  const styles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? '#0080ff' : '#999999',
      backgroundColor: state.isSelected ? '#1c1c1c' : provided.backgroundColor,
      '&:hover': {
        backgroundColor: '#333333'
      }
    }),
    control: provided => ({
      ...provided,
      width: props.width,
      border: 0,
      boxShadow: 'none'
    }),
  };

  const themeCb = theme => ({
    ...theme,
    borderRadius: 5,
    colors: {
      ...theme.colors,
      primary25: '#1c1c1c', // hover
      neutral20: '#c0c0c0', // border
      primary: '#000',
      neutral0: '#1c1c1c', // '#22252b', // background
      neutral80: '#bfbfbf', // placeholder
      neutral90: 'white'
    }
  });

  return (
    <div className="single-select-dropdown">
      <span className="prefix-text-dropdown" style={{
        paddingLeft: '8px'
      }}>
        <i className="fa fa-clock-o" aria-hidden="true"/>
      </span>
      <Select
        {...props}
        components={{
          IndicatorSeparator: null,
        }}
        isSearchable={false}
        onChange={value => props.onChange(value)}
        styles={styles}
        theme={themeCb}
        getOptionLabel ={(option)=>option.label}
      />
      <span className="postfix-text-dropdown" style={{
      }}>{props.postfixText}</span>
    </div>
  );
};
