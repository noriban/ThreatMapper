import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import {Navigation} from '../common/navigation';
import HeaderView from '../common/header-view/header-view';

export const AuthenticatedLayout = ({ children, hideLuceneQuery }) => {
  const { isFiltersViewVisible, isSideNavCollapsed } = useSelector(state => {
    return {
      isSideNavCollapsed: state.get('isSideNavCollapsed'),
      isFiltersViewVisible: state.get('isFiltersViewVisible'),
    };
  });

  const contentClassName = classNames({
    'collapse-side-nav': isSideNavCollapsed,
    'expand-side-nav': !isSideNavCollapsed,
    'show-filters-view': isFiltersViewVisible,
    'hide-filters-view': !isFiltersViewVisible,
  });

  return (
    <div>
      <Navigation />
      <div>
        <HeaderView hideLuceneQuery={hideLuceneQuery} />
        <div className={contentClassName}>{children}</div>
      </div>
    </div>
  );
};
