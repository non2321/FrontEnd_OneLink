import React from 'react'
import { connect } from 'react-redux'

import { userAuth } from '../../../../../actions/auth'

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from '../../../../../components'
import { ScreenIDReportReceiptsAllVendorByRegion, PathBackEnd, } from '../../../../../../../settings'

class ReceiptsAllVendorByRegion extends React.Component {
    constructor(props) {
        super(props)

        if (this.state === undefined) {
            const prm = {
                screen_id: ScreenIDReportReceiptsAllVendorByRegion,
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

const connectedReceiptsAllVendorByRegion = connect(mapStateToProps)(ReceiptsAllVendorByRegion);
export default connectedReceiptsAllVendorByRegion