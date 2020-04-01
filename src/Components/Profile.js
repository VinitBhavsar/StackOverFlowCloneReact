import React, { Component } from 'react';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <React.Fragment>
                <div className="text-white">
                    Welcome  {this.props.firstName + " " + this.props.lastName}
                </div>
            </React.Fragment>
        );
    }
}

export default Profile;