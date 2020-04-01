import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { url } from '../App';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { Growl } from 'primereact/growl';
import axios from 'axios';

class UserProfileSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '', fnameError: '',
            lastname: '', lnameError: '',
            emailAddress: '', emailError: '',
            password: '', passError: '',
            newPass: '', newPassError: '',
            repeatPassword: '', repassError: '',
            personalInfo: 0, changeEmail: 0, changePass: 0, profilePicture: 0,
            securityQuestions: [], sqid: '', sq_answer: '',
            visible: false, checked: false, sideBarvisible: false,
            selectedFile: null,
        }
        this.spanStyle = {
            color: 'red'
        }

        //method-binding
        this.onHide = this.onHide.bind(this);
    }

    componentDidMount() {
        document.title = "QnA | User Settings"
        if (sessionStorage.getItem("userid") !== null) {
            this.getSecurityQuestions();
            this.getUserDetails();
        }
        else {
            this.props.history.push("/login");
        }
    }

    getSecurityQuestions() {
        fetch(url + "getSecurityQuestions")
            .then(res => {
                return res.json()
            })
            .then(result => {
                console.log(result)
                this.setState({
                    securityQuestions: result
                })
            })
    }

    getUserDetails() {
        let data = {
            user_id: sessionStorage.getItem("userid")
        }
        fetch(url + "getUserDetailsByUserId", {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(res => {
                return res.json();
            })
            .then(result => {
                console.log(result)
                this.setState({
                    firstname: result[0].firstName,
                    lastname: result[0].lastName,
                    emailAddress: result[0].emailAddress
                })
            })
    }

    handleFirstNameChange(value) {

        let fname = value;
        let reg = /^[a-zA-Z]*$/;
        let valid = false;

        if (fname === '') {
            valid = false;
            this.setState({
                fnameError: '* Please Enter Firstname'
            })
        }
        else if (!reg.test(fname)) {
            valid = false;
            this.setState({
                fnameError: '* Please Enter Alphabet'
            })
        }
        else {
            valid = true;
            this.setState({
                fnameError: ''
            })
        }
        this.setState({
            firstname: fname
        })
        return valid;
    }

    handleLastNameChange(value) {

        let lname = value;
        let reg = /^[a-zA-Z]*$/;
        let valid = false;

        if (lname === '') {
            valid = false;
            this.setState({
                lnameError: '* Please Enter Lastname'
            })
        }
        else if (!reg.test(lname)) {
            valid = false;
            this.setState({
                lnameError: '* Please Enter Alphabet'
            })
        }
        else {
            valid = true;
            this.setState({
                lnameError: ''
            })
        }
        this.setState({
            lastname: lname
        })
        return valid;
    }

    infovalidation = () => {

        let valid = false;

        let isFnameValid = this.handleFirstNameChange(this.state.firstname);
        let isLnameValid = this.handleLastNameChange(this.state.lastname);

        if (!isFnameValid) {
            valid = false;
        }
        else if (!isLnameValid) {
            valid = false;
        }
        else {
            valid = true;
        }
        return valid;
    }

    updatePersonalInfo() {

        let valid = this.infovalidation();

        if (valid) {
            let data = {
                firstName: this.state.firstname,
                lastName: this.state.lastname,
                user_id: sessionStorage.getItem("userid")
            }
            fetch(url + "updatePersonalInfo", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(res => {
                    if (res.status === 200) {
                        this.setState({
                            personalInfo: 0
                        })
                        sessionStorage.setItem("firstname", this.state.firstname);
                        sessionStorage.setItem("lastname", this.state.lastname)
                        this.growl.show({ severity: 'success', summary: 'Success Message', detail: 'Personal Info Updated' });
                    }
                })
        }
    }

    uploadHandler(value) {
        let valid = false;
        if (value === null || value === undefined) {
            valid = false;
            this.setState({
                fileError: '* Please Select File'
            })
        }
        else {
            var checkimg = (value.name).toLowerCase();

            if (value.size > 1500000) {
                valid = false;
                this.setState({
                    fileError: '* File Size Should Be Less Than 1.5 MB'
                })
            }
            else if (!checkimg.match(/(\.jpg|\.png|\.JPG|\.PNG|\.jpeg|\.JPEG)$/)) {
                valid = false;
                this.setState({
                    fileError: '* Please Select .png / .jpeg / .jpg file'
                })
            }

            else if (value.name === null) {
                valid = false;
                this.setState({
                    fileError: '* Please Select File'
                })
            }
            else {
                valid = true;
                this.setState({
                    fileError: ''
                })
            }
        }

        this.setState({
            selectedFile: value,
        })
        return valid;
    }

    fileValidation = () => {
        let valid = false;

        let isFileValid = this.uploadHandler(this.state.selectedFile);

        if (!isFileValid) {
            valid = false;
        }
        else {
            valid = true;
        }
        return valid;
    }

    uploadImage() {
        const data = new FormData();

        data.append('file', this.state.selectedFile);
        data.append('userid', sessionStorage.getItem("userid"));

        let valid = this.fileValidation();

        if (valid) {
            axios.post(url + "uploadImages", data)

                .then(res => {
                    if (res.status === 200) {
                        console.log(res.statusText);
                        console.log(res);
                        this.setState({
                            profilePicture: 0
                        })
                        this.growl.show({ severity: 'success', summary: 'Success Message', detail: 'Image Uploaded' });
                    }
                    else {
                        console.log(res.statusText);
                        console.log(res);
                        this.growl.show({ severity: 'error', summary: 'Error Message', detail: 'Something Went Wrong' });
                    }
                })
        }
    }

    handleEmailAddressChange(value) {
        let email = value;
        // eslint-disable-next-line no-useless-escape
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let valid = false;

        const check = this.checkEmailRegistred(email);

        if (email === '') {
            valid = false;
            this.setState({
                emailError: '* Email Address Is Required'
            })
        }
        else if (!reg.test(email)) {
            valid = false;
            this.setState({
                emailError: '* Not Valid Email Address'
            })
        }
        else if (check === false) {
            valid = false;
        }
        else {
            valid = true;
            this.setState({
                emailError: ''
            })
        }
        this.setState({
            emailAddress: email
        })
        return valid;
    }

    emailValidation = () => {
        let valid = false;

        let isEmailValid = this.handleEmailAddressChange(this.state.emailAddress);

        if (!isEmailValid) {
            valid = false;
        }
        else {
            valid = true;
        }
        return valid;
    }

    checkEmailRegistred(value) {
        let valid = false;
        fetch(url + "checkEmailRegistered/" + value + "/" + sessionStorage.getItem("userid"))
            .then(res => {
                if (res.status === 302) {
                    this.setState({
                        emailError: "Already Registered Email Address"
                    })
                    valid = false;
                }
                else {
                    this.setState({
                        emailError: ""
                    })
                    valid = true
                }
            })
        return valid;
    }

    updateEmailAddress() {
        let valid = this.emailValidation();

        if (valid) {
            let data = {
                emailAddress: this.state.emailAddress,
                user_id: sessionStorage.getItem("userid")
            }
            fetch(url + "updateEmailAddress", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(res => {
                    if (res.status === 200) {
                        this.setState({
                            changeEmail: 0
                        })
                        this.growl.show({ severity: 'success', summary: 'Success Message', detail: 'Email Address Updated' });
                    }
                })
        }
    }

    handleOldPassword(value) {
        let oldPass = value;
        let valid = false;

        if (oldPass === '') {
            valid = false;
            this.setState({
                passError: '* Please Enter Old Password'
            })
        }
        else {
            valid = true;
            this.setState({
                passError: ''
            })
        }
        this.setState({
            password: oldPass
        })
        return valid;
    }

    handleNewPassword(value) {
        let newPassword = value;
        let valid = false;

        if (newPassword === '') {
            valid = false;
            this.setState({
                newPassError: '* Please Enter New Password'
            })
        }
        else if (newPassword.length < 8) {
            valid = false;
            this.setState({
                newPassError: '* To Short Password (Password Length : 8 to 16)'
            })
        }
        else if (newPassword.length > 16) {
            valid = false;
            this.setState({
                newPassError: '* To Long Password (Password Length : 8 to 16)'
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

    handleRepeatPassword(value) {
        let repass = value;
        let valid = false;

        if (repass === '') {
            valid = false;
            this.setState({
                repassError: '* Please Enter Your Password Again'
            })
        }
        else if (repass !== this.state.newPass) {
            valid = false;
            this.setState({
                repassError: '* Password Does Not Match'
            })
        }
        else {
            valid = true;
            this.setState({
                repassError: ''
            })
        }
        this.setState({
            repeatPassword: repass
        })
        return valid;
    }

    passValidation = () => {
        let valid = false;

        let isOldPassValid = this.handleOldPassword(this.state.password);
        let isNewPassValid = this.handleNewPassword(this.state.newPass);
        let isRePassValid = this.handleRepeatPassword(this.state.repeatPassword);

        if (!isOldPassValid) {
            valid = false;
        }
        else if (!isNewPassValid) {
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

    updatePassword() {
        let valid = this.passValidation();

        if (valid) {
            let data = {
                password: this.state.password,
                user_id: sessionStorage.getItem("userid")
            }
            fetch(url + "checkPassword", {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(res => {
                    console.log(res.url);
                    if (res.status === 200) {
                        let newData = {
                            password: this.state.newPass,
                            user_id: sessionStorage.getItem("userid")
                        }
                        fetch(url + "updatePassword", {
                            method: 'PUT',
                            headers: { 'Content-type': 'application/json' },
                            body: JSON.stringify(newData)
                        })
                            .then(res => {
                                if (res.status === 200) {
                                    this.setState({
                                        changePass: 0
                                    })
                                }
                                this.growl.show({ severity: 'success', summary: 'Success Message', detail: 'Password Updated' });
                            })
                    }
                    else {
                        this.growl.show({ severity: 'error', summary: 'Error Message', detail: 'Current Password Is Incorrect' });
                    }
                })
        }
        this.setState({
            password: '', newPass: '',
            repeatPassword: ''
        })
    }

    deleteAccount() {
        console.log(sessionStorage.getItem("userid"))
        fetch(url + "deleteAccount/" + sessionStorage.getItem("userid"), {
            method: 'DELETE',
        })
            .then(res => {
                if (res.status === 200) {
                    sessionStorage.clear();
                    sessionStorage.setItem("deletestatus", true);
                    this.props.history.push("/");
                }
            })
    }
    onHide() {
        this.setState({ visible: false });
    }

    render() {
        const footer = (
            <div>
                <button className="btn btn-danger" disabled={this.state.checked === false ? true : ""}
                    onClick={() => this.deleteAccount()}>
                    Delete Account
                    </button>
                <button className="btn btn-primary" onClick={() => this.setState({
                    visible: 0
                })}>
                    Cancel
                </button>
            </div>
        );
        return (
            <React.Fragment>
                <div className="container float-left mt-5 ml-5">
                    <h3 style={{ color: '' }}>Personal Information</h3>
                    <br />
                    {
                        this.state.personalInfo === 0 ?
                            <Link onClick={() => this.setState({
                                personalInfo: 1,
                                changeEmail: 0,
                                changePass: 0,
                                profilePicture: 0
                            })}>
                                Edit Personal Information
                                </Link> : <React.Fragment>
                                <div className="row">
                                    <div className="col-sm-5">
                                        <label>First Name :</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-3">
                                        <input type="text" className="form-control" value={this.state.firstname}
                                            onChange={(e) => this.handleFirstNameChange(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <span style={this.spanStyle}>{this.state.fnameError}</span>
                                <div className="row">
                                    <div className="col-sm-5">
                                        <label>Last Name :</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-3">
                                        <input type="text" className="form-control" value={this.state.lastname}
                                            onChange={(e) => this.handleLastNameChange(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <span style={this.spanStyle}>{this.state.lnameError}</span>
                                <br />
                                <div className="row ml-0">
                                    <div classNames="col-sm-12">
                                        <button className="btn btn-success text-white"
                                            onClick={() => this.updatePersonalInfo()}>
                                            Update
                                            </button> &nbsp;
                                        <button className="btn btn-primary" onClick={() => this.setState({
                                            personalInfo: 0
                                        })}>
                                            Cancle
                                        </button>
                                    </div>

                                </div>
                            </React.Fragment>
                    }
                    <br />
                    {
                        this.state.profilePicture === 0 ? <Link onClick={() => this.setState({
                            profilePicture: 1, changeEmail: 0, personalInfo: 0, changePass: 0
                        })}>
                            Upload Profile Picture</Link> : <React.Fragment>
                                <br />
                                <div className="row">
                                    <div className="col-sm-5">
                                        <label>Upload Profile Picture</label>
                                    </div>
                                </div>
                                <span style={this.spanStyle}>{this.state.fileError}</span>
                                <div className="row">
                                    <div className="col-sm-5">
                                        <input type="file" name="file" className="btn btn-warning"
                                            onChange={(e) => this.uploadHandler(e.target.files[0])}
                                        />
                                        <br />

                                        <br />
                                        <button className="btn btn-success text-white"
                                            onClick={() => this.uploadImage()}>
                                            Upload
                                        </button> &nbsp;
                                        <button className="btn btn-primary" onClick={() => this.setState({
                                            profilePicture: 0
                                        })}>
                                            Cancle
                                        </button>
                                    </div>
                                </div>
                                <br />
                            </React.Fragment>
                    }

                    <br />
                    <h3 style={{ color: '' }}>Account Settings</h3>
                    <br />
                    {
                        this.state.changeEmail === 0 ? <Link onClick={() => this.setState({
                            changeEmail: 1, personalInfo: 0, changePass: 0, profilePicture: 0
                        })}>
                            Edit Email Settings
                    </Link> : <React.Fragment>
                                <br />
                                <div className="row">
                                    <div className="col-sm-5">
                                        <label>Email Address :</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-5">
                                        <input type="text" className="form-control" value={this.state.emailAddress}
                                            onChange={(e) => this.handleEmailAddressChange(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <span style={this.spanStyle}>{this.state.emailError}</span>
                                <br />
                                <div className="row ml-0">
                                    <div classNames="col-sm-12">
                                        <button className="btn btn-success text-white"
                                            onClick={() => this.updateEmailAddress()}>
                                            Update
                                        </button> &nbsp;
                                        <button className="btn btn-primary" onClick={() => this.setState({
                                            changeEmail: 0
                                        })}>
                                            Cancle
                                        </button>
                                    </div>
                                </div>
                            </React.Fragment>
                    }
                    <br />
                    {
                        this.state.changePass === 0 ? <Link onClick={() => this.setState({
                            changePass: 1, personalInfo: 0, changeEmail: 0, profilePicture: 0
                        })}>
                            Change Your Password
                        </Link> : <React.Fragment>
                                <br />
                                <div className="row">
                                    <div className="col-sm-5">
                                        <label>Current Password :</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-5">
                                        <input type="password" className="form-control" value={this.state.password}
                                            onChange={(e) => this.handleOldPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <span style={this.spanStyle}>{this.state.passError}</span>
                                <div className="row">
                                    <div className="col-sm-5">
                                        <label>New Password :</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-5">
                                        <input type="password" className="form-control" value={this.state.newPass}
                                            onChange={(e) => this.handleNewPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <span style={this.spanStyle}>{this.state.newPassError}</span>
                                <div className="row">
                                    <div className="col-sm-5">
                                        <label>Repeat New Password :</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-5">
                                        <input type="password" className="form-control" value={this.state.repeatPassword}
                                            onChange={(e) => this.handleRepeatPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <span style={this.spanStyle}>{this.state.repassError}</span>
                                <br />
                                <div className="row ml-0">
                                    <div classNames="col-sm-12">
                                        <button className="btn btn-success text-white"
                                            onClick={() => this.updatePassword()}>
                                            Update
                                            </button> &nbsp;
                                        <button className="btn btn-primary" onClick={() => this.setState({
                                            changePass: 0, password: '', newPass: '', repeatPassword: ''
                                        })}>
                                            Cancle
                                        </button>
                                    </div>
                                </div>
                            </React.Fragment>
                    }
                    <br />
                    <Link onClick={() => this.setState({
                        visible: 1
                    })}>
                        Delete Profile
                    </Link>
                </div>
                <Dialog header="Account Delete" visible={this.state.visible} style={{ width: '50vw' }} footer={footer} onHide={this.onHide} maximizable>
                    <p>
                        Before confirming that you would like your profile deleted, we'd like to take a moment to explain the implication of deletion.
                    </p>
                    <br />
                    <p>
                        <li>
                            Deletion is irreversible, and you will have no way to regain any of your content, should this deletion be carried
                            out and you change your mind later on.
                        </li>
                        <li>
                            Your questions and answers will remain on the site, but will be disassociated and anonymized (the author will be
                            listed as "user 0000") and will not indicate your authorship even if you return to the site.
                        </li>
                    </p>
                    <br />
                    <p>
                        We're sorry to hear you would like your profile to be deleted. While we respect your decision to proceed with this process,
                        we'd like to offer you the option of having any concerns or specific incidents heard out before doing so. If you'd like to
                        talk someone. please feel free to <Link>contact us</Link> for further assistance.
                    </p>
                    <p>
                        Confirming deleteion will only delete your profile on QnA - it will not affect any of your other profiles on QnA network. If
                        you want to delete multiple profiles, you'll need to visit each site separately and request deletion of those individual profile.
                    </p>
                    <p>
                        <Checkbox onChange={e => this.setState({ checked: e.checked })} checked={this.state.checked}></Checkbox> , I have read the
                        information stated above and understand the implication of having my profile deleted. I wish to proceed with deletion of my profile.
                    </p>
                </Dialog>
                <Growl ref={(el) => this.growl = el} className="mt-5" />
            </React.Fragment>
        );
    }
}