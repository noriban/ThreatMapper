import React from 'react';
import {
  Root as NavigationRoot,
  List as NavigationList,
  Item as NavigationItem,
  Trigger as NavigationTrigger,
  Link as NavigationLink,
  Content as NavigationContent,
  Sub as SubNavigationMenu,
} from '@radix-ui/react-navigation-menu';
import { Link, NavLink, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import styles from './index.module.scss';
import { NAVIGATION_MENU_COLLECTION } from '../../../constants/menu-collection';
import BRAND_LOGO_WITHOUT_NAME from '../../../../images/Deepfence_Logo_Mark.svg';

const Navigation = ({ navMenuCollection, activeMenu, ...props }) => {
  return (
    <NavigationRoot className={styles.navigationRoot} orientation="vertical">
      <NavigationList className={styles.navigationRootList}>
        <NavigationItem className={styles.navigationMenuItem}>
          <NavigationTrigger className={styles.navigationLogoTrigger}>
            <Link to="/topology">
              <img
                src={BRAND_LOGO_WITHOUT_NAME}
                alt="DeepFence Logo"
                className={styles.navigationLogoImg}
              />
            </Link>
          </NavigationTrigger>
        </NavigationItem>
        {NAVIGATION_MENU_COLLECTION.map(navItem => {
          return (
            <NavigationItem
              className={styles.navigationMenuItem}
              key={navItem.id}
            >
              <NavigationTrigger className={styles.navigationMenuTrigger}>
                {navItem.items?.length ? (
                  <NavigationLink
                    active={props?.match?.path?.startsWith(navItem.link)}
                    className={classNames(styles.navigationMenuLink, {
                      [styles.navigationMenuActiveLink]:
                        props?.match?.path?.startsWith(navItem.link),
                    })}
                  >
                    <div className={styles.navigationMenuIcon}>
                      <i
                        title={navItem.title}
                        className={navItem.menuIcon}
                        aria-hidden="true"
                      />
                    </div>
                    {navItem.name}
                  </NavigationLink>
                ) : (
                  <NavLink
                    tabIndex={-1}
                    to={navItem.link}
                    className={classNames(styles.navigationMenuLink, {
                      [styles.navigationMenuActiveLink]:
                        props?.match?.path?.startsWith(navItem.link),
                    })}
                  >
                    <div className={styles.navigationMenuIcon}>
                      <i
                        title={navItem.title}
                        className={navItem.menuIcon}
                        aria-hidden="true"
                      />
                    </div>
                    {navItem.name}
                  </NavLink>
                )}
              </NavigationTrigger>
              {navItem.items?.length ? (
                <NavigationContent className={styles.navigationContent}>
                  <SubNavigationMenu className={styles.subNavigationRoot}>
                    <NavigationList className={styles.subNavigationList}>
                      {navItem.items.map(subNavItem => {
                        return (
                          <NavigationItem
                            className={styles.subNavigationMenuItem}
                            key={subNavItem.id}
                          >
                            <NavigationTrigger
                              className={styles.subNavigationMenuTrigger}
                            >
                              <NavLink
                                tabIndex={-1}
                                to={subNavItem.link}
                                className={styles.subNavigationMenuLink}
                                activeClassName={
                                  styles.subNavigationMenuActiveLink
                                }
                              >
                                {subNavItem.name}
                              </NavLink>
                            </NavigationTrigger>
                          </NavigationItem>
                        );
                      })}
                    </NavigationList>
                  </SubNavigationMenu>
                </NavigationContent>
              ) : null}
            </NavigationItem>
          );
        })}
      </NavigationList>
    </NavigationRoot>
  );
};

const NavigationWithRouter = withRouter(Navigation)

export {
  NavigationWithRouter as Navigation
};
