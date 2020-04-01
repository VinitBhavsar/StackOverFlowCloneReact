import React, { Component } from 'react';
import { url } from '../App';
import { Growl } from 'primereact/growl';
class ResetPass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPass: '',
            newPassError: '',
            rePass: '',
            rePassError: '',
            emailAddress: ''
        }
        this.spanStyle = {
            color: 'red'
        }

        this.handleResetpass = this.handleResetpass.bind(this);
    }

    componentDidMount() {
        document.title = "Reset Password"
        if (localStorage.getItem("emailAddress") === null) {
            this.props.history.push("/login");
        }

        setTimeout(() => {
            location.replace("login");//eslint-disable-line
        }, 30000)

        console.log(localStorage.getItem("emailAddress"));

        let emailAddress = localStorage.getItem("emailAddress")
        this.setState({
            emailAddress: emailAddress
        })

        console.log("State Set");
        localStorage.clear();
        console.log(localStorage.getItem("emailAddress"));
        console.log("Clear");

    }
    handleNewPass(value) {
        let newPassword = value;
        let valid = false;

        if (newPassword === '') {
            valid = false;
            this.setState({
                newPassError: '* Please Enter Your New Password'
            })
        }
        else {
            valid = true;
            this.setState({
                newPassError: ''
            })
        }
        this.setState({
            newPass: newPassword
        })
        return valid;
    }

    handleRePass(value) {
        let rePassword = value;
        let valid = false;

        if (rePassword === '') {
            valid = false;
            this.setState({
                rePassError: '* Please Enter Your Password Again'
            })
        }
        else if (rePassword !== this.state.newPass) {
            valid = false;
            this.setState({
                rePassError: '* Password Does not match'
            })
        }
        else {
            valid = true;
            this.setState({
                rePassError: ''
            })
        }
        this.setState({
            rePass: rePassword
        })
        return valid;
    }

    validation = () => {
        let valid = false;

        let isNewPassValid = this.handleNewPass(this.state.newPass);
        let isRePassValid = this.handleRePass(this.state.rePass);

        if (!isNewPassValid) {
            valid = false;
        }
        else if (!isRePassValid) {
            valid = false;
        }
        else {
            valid = true;
        }
        return valid;
    }

    handleResetpass() {
        let valid = this.validation();

        if (valid) {
            fetch(url + "updatePassword/" + this.state.newPass + "/" + this.state.emailAddress, {
                method: 'GET'
            })
                .then(res => {
                    console.log(res.status);
                    if (res.status === 200) {
                        localStorage.setItem("passwordReset", "1");
                        localStorage.removeItem("emailAddress");
                        this.props.history.push("/login");
                    }
                })
        }
    }
    render() {
        return (
            <React.Fragment>
                {console.log(this.state.emailAddress)}
                <div className="container pt-5 mt-5">
                    <div className="row">
                        <div className="col-sm-4">
                            <input type="password" placeholder="New Password" value={this.state.newPass} className="form-control"
                                onChange={(e) => this.handleNewPass(e.target.value)} />
                        </div>
                        &nbsp;<span style={this.spanStyle}>{this.state.newPassError}</span>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-sm-4">
                            <input type="password" placeholder="Repeat Password" value={this.state.rePass} className="form-control"
                                onChange={(e) => this.handleRePass(e.target.value)} />
                        </div>
                        &nbsp;<span style={this.spanStyle}>{this.state.rePassError}</span>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-sm-4">
                            <button className="btn btn-success" onClick={this.handleResetpass}>
                                Reset Password
                          </button>
                        </div>
                    </div>
                </div>
                <Growl ref={(el) => this.growl = el} />
            </React.Fragment>
        );
    }
}

export default ResetPass;