import React from 'react';
import { Link, browserHistory } from 'react-router';

class Footer extends React.Component{
    render(){
        return (
            <div className="footer">
                <ul className="nav navbar-nav">
                    <li className="li-copy">
                        <span className="copyr">© CutiDeals.com</span>
                    </li>
                    <li className="li-hide">
                        <Link to="/about">About</Link>
                    </li>
                    <li className="li-hide">
                        <Link to="/terms">Terms of Service</Link>
                    </li>
                    <li className="li-hide">
                        <a href="mailto:hello@cutideals.com?Subject=Hello" target="_top">Say hello</a>
                    </li>
                </ul>
            </div>
        )
    }
}

export default Footer; 