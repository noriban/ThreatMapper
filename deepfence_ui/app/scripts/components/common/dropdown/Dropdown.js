import React from 'react';
import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu';
import { isEqual } from 'lodash';

export const Dropdown = (props) => {
    const { children, content, align = 'start', triggerAsChild, ...rest } = props;
    return (
      <DropdownPrimitive.Root {...rest}>
        <DropdownPrimitive.Trigger asChild={triggerAsChild}>
          {children}
        </DropdownPrimitive.Trigger>
        <DropdownPrimitive.Content
            sideOffset={4}
            align={align}
          >
            {content}
          </DropdownPrimitive.Content>
      </DropdownPrimitive.Root>
    );
  };

  export const DropdownTriggerElement = (props) => {
    const { value, style, LeftIcon } = props;

    return (
      <div className='radix-dropdown-wrapper' style={{
        ...style
      }}>
        { LeftIcon &&  <LeftIcon/> }
        <input type="button" value={value} style={{
          background: 'transparent',
          padding: '0 6px',
          fontSize: '14px'
        }}/>
        <span style={{
          paddingLeft: '4px',
          color: '#bfbfbf'
        }}>
        <i className="fa fa-angle-down" aria-hidden="true"/></span>
      </div>
    )
  }

  export const DropdownContent = (props) => {
    const {items, selectedItem, onSelect, ...rest} = props;
    const onItemSelection = (op) => onSelect(op)
    return (
      <div className='flex-col overflow-scroll radix-dropdown-content'>
          {
              items.map(op => {
                return (
                  <DropdownPrimitive.Item
                    key={op.vaue} {...rest}
                    className='radix-dropdown-item'
                    onSelect={() => onItemSelection(op)}
                    style={{
                      color: isEqual(selectedItem, op) ? '#0080ff' : ''
                    }}>
                    {op.label}
                  </DropdownPrimitive.Item>
                )
              })
            }
      </div>
    )
  }