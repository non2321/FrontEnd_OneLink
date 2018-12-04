import React from 'react'
import { connect } from 'react-redux';

import Header from './Header'
import Navigation from '../navigation/components/Navigation'
import Ribbon from '../ribbon/Ribbon'
import Footer from './Footer'
import Shortcut from '../navigation/components/Shortcut'

import LayoutSwitcher from '../layout/components/LayoutSwitcher'

import { smallBox, bigBox, SmartMessageBox } from '../utils/actions/MessageActions'

import { alertActions } from '../../actions/alert';

import store from '../../store/configureStore'

import { navigationInit } from "../navigation/NavigationActions";

import navItems from '../../config/navigation.json';

import Delay from 'react-delay'

import Loadable from 'react-loading-overlay'

//Alert
import Alert from 'react-s-alert';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';


class Layout extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    store.dispatch(navigationInit(navItems))
  }

  componentDidUpdate() {
    const { alert } = this.props;
    if (alert.type == 'alert-success') {
      smallBox({
        title: "Alert Success",
        //content: "Lorem ipsum dolor sit amet, test consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
        content: (alert.message == "") ? "Success" : alert.message,
        color: "#3276B1",
        //timeout: 8000,
        icon: "fa fa-check flip animated",
        timeout: 6000,
      });
      this.props.dispatch(alertActions.clear());
    }
    if (alert.type == 'alert-danger') {

      smallBox({
        title: "Alert Error",
        content: (alert.message == "") ? "Can't receive message from SQL Server" : alert.message,
        color: "#C46A69",
        timeout: 6000,
        icon: "fa fa-exclamation-circle flip animated"
      });
      this.props.dispatch(alertActions.clear());
    }
    if (alert.type == 'alert-warning') {

      smallBox({
        title: "Alert Warning",
        content: (alert.message == "") ? "Can't receive message from SQL Server" : alert.message,
        color: "#ffc107",
        timeout: 6000,
        icon: "fa fa-warning flip animated"
      });
      this.props.dispatch(alertActions.clear());
    }
  }


  render() {
    const location = this.props.location.pathname

    const navItem = this.props.items

    const { modify, loading } = this.props;

    let loadingdata = true
    let msgloading = 'Loading your content...'
    
    if (modify != undefined) {
      msgloading = 'Loading your content...'
      loadingdata = false

      if (loading.loading == true) {
        loadingdata = true
        msgloading = loading.message
      } else if (loading.loading == false) {
        loadingdata = false
        msgloading = 'Loading your content...'
      }
    } else if (location == '/home' || location == '/Home') {
      loadingdata = false
      msgloading = 'Loading your content...'
    }


    return (
      <div>
        <Header />
        <Delay wait={150} >
          {navItem &&
            <Navigation items={navItem} />
          }
        </Delay>
        <Ribbon />
        <Loadable
          active={loadingdata}
          spinner
          // spinnerSize={"100px"}      
          text={msgloading}>
          <div id="main" role="main">
            {this.props.children}
          </div>
        </Loadable>
        <Footer />
        <Shortcut />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { alert } = state;
  const { items } = state.navigation;
  const { loadpage } = state;
  const modify = loadpage.modify
  const { loading } = state;
  return {
    alert,
    items,
    modify,
    loading
  };
}

const connectedLayout = connect(mapStateToProps)(Layout);
export default connectedLayout



