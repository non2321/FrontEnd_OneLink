import React from 'react'
import { connect } from 'react-redux'

import { userAuth } from '../../../../../actions/auth'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../../components'
import { ScreenIDReportDetailStockTransferOut, PathBackEnd, } from '../../../../../../../settings'

class DetailStockTransferOut extends React.Component {
    constructor(props) {
        super(props)

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDReportDetailStockTransferOut,
            }
            this.props.dispatch(userAuth.loadpage(prm))
        }        
    }  
    
    render() {
        return (
            <div id="content">
                <WidgetGrid>
                    
                </WidgetGrid>
            </div>
        )
    }
}


function mapStateToProps(state) {
    const { loadpage, report } = state;
    const screen_name = loadpage.screen_name
    const modify = loadpage.modify
    return {
        modify,
        screen_name,
        report
    };
}

const connectedDetailStockTransferOut = connect(mapStateToProps)(DetailStockTransferOut);
export default connectedDetailStockTransferOut