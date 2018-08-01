import React from 'react'
import { Link } from 'react-router';
import { connect } from 'react-redux';

// import { SyncLoader } from 'react-spinners';

import { userActions } from '../../../actions/user';
import { alertActions } from '../../../actions/alert';
import { ScreenIDLOGIN } from '../../../../../settings'

import { smallBox, bigBox, SmartMessageBox } from '../../../components/utils/actions/MessageActions'

import UiValidate from '../../../components/forms/validation/UiValidate'

// import './Login.css'

class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      submitted: true,
      screen_id: ScreenIDLOGIN,
      loading: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });   
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { username, password, screen_id } = this.state;
    const { dispatch } = this.props;
    if (username && password) {
      const prm = {
        username: username,
        password: password,
        screen_id: screen_id,
      }
      dispatch(userActions.login(prm));
    }    
  }

  render() {
    const { loggingIn } = this.props;
    
    const { username, password, submitted } = this.state;

    const { alert } = this.props;
    
    if (alert.type == 'alert-success' && submitted == true) {     
     

      this.state.submitted = false 
    }
    if (alert.type == 'alert-danger' && submitted == true) {         
      smallBox({
        title: "Alert Error",
        content: (alert.message == "")? "Can't receive message from SQL Server": alert.message,
        color: "#C46A69",
        timeout: 6000,
        icon: "fa fa-exclamation-circle flip animated"
      });
      this.state.submitted = false 
      
      this.props.dispatch(alertActions.clear());
    }


    return (
      // <div className='sweet-loading'>
      //  <div class="loading">Loading&#8230;</div>  
      //    <SyncLoader
      //     color={'#3276b1'} 
      //     loading={this.state.loading} 
      //   />
      //</div>
      <div id="extr-page">         
        <div id="main" role="main" className="animated fadeInDown">
          <div id="content" className="container">
            <div className="row">
              <div className="col-lg-4 col-lg-offset-4">
                <div className="well no-padding">
                  <UiValidate>
                    <form onSubmit={this.handleSubmit} id="login-form" className="smart-form client-form">
                      <header>
                        Sign In
                      </header>
                      <fieldset>
                        <section>
                          <label className="label">E-mail</label>
                          <label className="input"> <i className="icon-append fa fa-user" />
                            <input type="text" name="username" value={username} onChange={this.handleChange} data-smart-validate-input="" data-required=""
                              data-message-required="Please enter your username"
                              data-message-email="Please enter a VALID username" />
                            <b className="tooltip tooltip-top-right"><i className="fa fa-user txt-color-teal" />
                              Please enter username</b></label>
                        </section>
                        <section>
                          <label className="label">Password</label>
                          <label className="input"> <i className="icon-append fa fa-lock" />
                            <input type="password" name="password" value={password} onChange={this.handleChange} data-smart-validate-input="" data-required=""
                              data-minlength="1" data-maxnlength="20"
                              data-message="Please enter your password" />
                            <b className="tooltip tooltip-top-right"><i className="fa fa-lock txt-color-teal" /> Enter
                              your password</b> </label>

                          <div className="note">
                          </div>
                        </section>
                      </fieldset>
                      <footer>
                        <button type="submit" className="btn btn-primary">
                          Sign in
                        </button>
                        {loggingIn &&
                          <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                      </footer>
                    </form>
                  </UiValidate>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    )
  }
}

function mapStateToProps(state) {
  const { loggingIn } = state.authentication;
  const { alert } = state;

  return {
    loggingIn,
    alert
  };
}

const connectedLogin = connect(mapStateToProps)(Login);

export default connectedLogin