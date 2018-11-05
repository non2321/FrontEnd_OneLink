import React from 'react'
import { browserHistory } from 'react-router'
import { routerActions } from 'react-router-redux';

import FullScreen from './FullScreen'
import ToggleMenu from './ToggleMenu'

import { connect } from 'react-redux';
import { userActions } from '../../actions/user';

import { localStorageAuth } from '../../../../settings'

class Header extends React.Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this);
    const user = JSON.parse(localStorage.getItem(localStorageAuth));
    this.state = {
      user: (user) ? `${user.firstname} ${user.lastname}` : '',
      position: (user) ? `${user.position}` : ''
    }
  }


  handleClick() {
    this.props.dispatch(userActions.logout());
  }


  render() {
    const { user, position } = this.state;

    return <header id="header">
      <div id="logo-group">
        <span id="logo">
          <img src="assets/img/logo.png" // place your logo here
            alt="SmartAdmin" />
        </span>
        {/* Note: The activity badge color changes when clicked and resets the number to 0
         Suggestion: You may want to set a flag when this happens to tick off all checked messages / notifications */}

        {/* <Activities /> */}
      </div>

      {/* <RecentProjects /> */}
      <div className="pull-right"  /*pulled right: nav area*/ >


        <ToggleMenu className="btn-header pull-right"  /* collapse menu button */ />


        {/* #MOBILE */}
        {/*  Top menu profile link : this shows only when top menu is active */}
        <ul id="mobile-profile-img" className="header-dropdown-list hidden-xs padding-5">
          <li className="">
            <a className="dropdown-toggle no-margin userdropdown" data-toggle="dropdown">
              <img src="assets/img/avatars/sunny.png" alt="John Doe" className="online" />
            </a>
            <ul className="dropdown-menu pull-right">
              <li>
                <a className="padding-10 padding-top-0 padding-bottom-0"><i
                  className="fa fa-cog" /> Setting</a>
              </li>
              <li className="divider" />
              <li>
                <a href="#/views/profile"
                  className="padding-10 padding-top-0 padding-bottom-0"> <i className="fa fa-user" />
                  <u>P</u>rofile</a>
              </li>
              <li className="divider" />
              <li>
                <a className="padding-10 padding-top-0 padding-bottom-0"
                  data-action="toggleShortcut"><i className="fa fa-arrow-down" /> <u>S</u>hortcut</a>
              </li>
              <li className="divider" />
              <li>
                <a className="padding-10 padding-top-0 padding-bottom-0"
                  data-action="launchFullscreen"><i className="fa fa-arrows-alt" /> Full
                  <u>S</u>creen</a>
              </li>
              <li className="divider" />
              <li>
                <a href="#/login" className="padding-10 padding-top-5 padding-bottom-5"
                  data-action="userLogout"><i
                    className="fa fa-sign-out fa-lg" /> <strong><u>L</u>ogout</strong></a>
              </li>
            </ul>
          </li>
        </ul>


        <FullScreen className="btn-header transparent pull-right" />

        {/* logout button */}
        <div id="logout" className="btn-header transparent pull-right">

          <span> <a title="Sign Out" onClick={this.handleClick}
            data-logout-msg="You can improve your security further after logging out by closing this opened browser"><i
              className="fa fa-sign-out" />
          </a></span>
        </div>
        <div id="position" className="btn-header transparent pull-right form-group">
          <div className="col-md-12" style={{ 'padding-top': '5px' }}>
            <h9 style={{ 'color': '#fff', 'float': 'right' }}>{user}</h9>
          </div>
          <div className="col-md-12">
            <h9 style={{ 'color': '#fff', 'float': 'right' }}>{position}</h9>
          </div>
        </div>
      </div>

      {/* end pulled right: nav area */}


    </header >
  }
}

const connectedHeader = connect(null)(Header);

export default connectedHeader