/**
 * Created by griga on 11/24/15.
 */

import React from 'react'

import NavMenu from './NavMenu'

import MinifyMenu from './MinifyMenu'

import { connect } from 'react-redux';

// import LoginInfo from '../../user/components/LoginInfo'

// import AsideChat from '../../chat/components/AsideChat'

import Delay from 'react-delay'

export default class Navigation extends React.Component {

  render() {
    const navItem = this.props.items
    return (
      <aside id="left-panel">
        {/* <LoginInfo /> */}
        <nav>
          <NavMenu items={navItem}
            openedSign={'<i class="fa fa-minus-square-o"></i>'}
            closedSign={'<i class="fa fa-plus-square-o"></i>'}
          />
          {/* <AsideChat /> */}
        </nav>
        <MinifyMenu />
      </aside>
    )
  }
}
