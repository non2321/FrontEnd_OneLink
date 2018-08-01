import React from 'react'

export default class NotFound extends React.Component{
    render() {
        return (
            <div id="content">
                {/* row */}
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="text-center error-box">
                                    <h1 className="error-text tada animated"><i className="fa fa-times-circle text-danger error-icon-shadow"/> Error 404</h1>
                                    <h2 className="font-xl"><strong>Oooops, We can't seem to find the page you're looking for.</strong></h2>
                                    <br/>
                                    <p className="lead semi-bold">
                                        <strong>Page Not Found</strong><br/><br/>
                                        <small>
                                        The page you requested could not be found, either contact your webmaster or try again. Use your browsers Back button to navigate to the page you have prevously come from
                                        </small>
                                    </p>
                                    <ul className="error-search text-left font-md">
                                        <li><a href="#/Home"><small>Go to Home Page <i className="fa fa-arrow-right"/></small></a></li>
                                        {/* <li><a href="#"><small>Contact SmartAdmin IT Staff <i className="fa fa-mail-forward"/></small></a></li>
                                        <li><a href="#"><small>Report error!</small></a></li>
                                        <li><a href="#"><small>Go back</small></a></li> */}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* end row */}
            </div>
        )
    }
}