import React from 'react'
import { connect } from 'react-redux';
import { userAuth } from '../../../actions/auth';
import { alertActions } from '../../../actions/alert'
import { Slide, Zoom } from 'react-slideshow-image';

import { ScreenIDHomePage } from '../../../../../settings'

const slideImages = [
    'https://responsive.tillster.com/responsive/ph-thailand/1540497458/img/home_hero_desktop.png',
    'https://responsive.tillster.com/responsive/ph-thailand/1540497458/img/menu_banner_desktop.jpg',
    'https://d2q3ga2hep3gmx.cloudfront.net/mobilem8-php/wp-content/uploads/2018/10/Deals-category-DESKTOP-1200x304_TH_opt.png'
];

const properties = {
    duration: 5000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: true
}

const zoomOutProperties = {
    duration: 5000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    scale: 0.4,
    arrows: true
}

const styleHeader = {
    // 'text-align': 'center',
    // 'padding-top': '20px',
    // 'margin': '0',
    'position': 'absolute',
    'top': '50%',
    'left': '50%',
    'transform': 'translate(-50%, -50%)'
}

const styleText = {
    'font-family': 'Sucrose Bold Two'
}

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
                <Slide {...properties}>
                    <div className="each-slide" style={{'position': 'relative','text-align': 'center'}}> <img key={0} style={{ width: "100%" }} src={slideImages[0]} /><div style={styleHeader}><h1 style={{'color':'rgba(60, 60, 60, 0.8)'}}>WELCOME</h1><h1 style={{'color':'rgba(255, 0, 0, 0.8)'}}>OneLink</h1></div></div>
                    <div className="each-slide" style={{'position': 'relative','text-align': 'center'}}> <img key={1} style={{ width: "100%" }} src={slideImages[1]} /></div>
                    <div className="each-slide" style={{'position': 'relative','text-align': 'center'}}> <img key={2} style={{ width: "100%" }} src={slideImages[2]} /></div>
                </Slide>               
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