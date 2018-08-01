import React from 'react'
import { connect } from 'react-redux';
import { userAuth } from '../../../actions/auth';
import { alertActions } from '../../../actions/alert'

import { ScreenIDHomePage } from '../../../../../settings'

class Home extends React.Component {
    constructor(props) {
        super(props);
       
        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDHomePage,          
            }    
            this.props.dispatch(userAuth.loadpage(prm))
        }       
    }
    

    render() {
        return (
            <div id="content">


            </div>
        )
    }
}

function mapStateToProps(state) {  
    return {
    };
  }
  
  const connectedHome = connect(mapStateToProps)(Home);
  export default connectedHome