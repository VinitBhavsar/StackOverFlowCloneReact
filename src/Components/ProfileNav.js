import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class ProfileNav extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <React.Fragment>
                <div className="container mt-5">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <Link className="nav-link" to={`/profile/${this.props.profileId}`}>Profile</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={`/${this.props.profileId}/activity`}>Activity</Link>
                        </li>
                    </ul>
                </div>
                <br/>
            </React.Fragment>
        );
    }
}

export default ProfileNav;