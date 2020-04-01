import React, { Component } from 'react';
import { url } from '../App';
import { Growl } from 'primereact/growl';

class PasswordForget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailAddress: '',
            emailError: '',
            answer: '',
            answerError: '',
            selectionError: '',
            selectId: '',
            securityQuestions: []
        }
        this.spanStyle = {
            color: "red"
        }
        this.submitDetail = this.submitDetail.bind(this);
    }

    componentDidMount() {
        document.title = "Forget Password"
        this.getSecurityQuestions();
    }

    getSecurityQuestions() {
        fetch(url + "getSecurityQuestions", {
            method: 'GET'
        })
            .then(res => {
                return res.json();
            })
            .then(result => {
                console.log(result);
                this.setState({
                    securityQuestions: result
                })
            })
            .catch(err => {
                console.log(err);
            })
    }

    handleEmailAddress(value) {
        let email = value;
        // eslint-disable-next-line no-useless-escape
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let valid = false;

        if (email === '') {
            this.setState({
                emailError: '* Please Enter Email Address'
            })
            valid = false;
        }
        else if (!reg.test(email)) {
            this.setState({
                emailError: '* Not Valid Email Address'
            })
            valid = false;
        }
        else {
            this.setState({
                emailError: ''
            })
            valid = true;
        }
        this.setState({
            emailAddress: email
        })
        return valid;
    }

    handleSeletedValue(value) {
        let sqid = value;
        let valid = false;

        if (sqid === '') {
            valid = false;
            this.setState({
                selectionError: '* Please Select Security Question'
            })
        }
        else {
            valid = true;
            this.setState({
                selectionError: ''
            })
        }
        this.setState({
            selectId: sqid
        })
        return valid;
    }

    handleAnswer(value) {
        let ans = value;
        let valid = false;

        if (ans === '') {
            valid = false;
            this.setState({
                answerError: "* Answer Is Required"
            })
        }
        else if (ans.trim() === '') {
            valid = false;
            this.setState({
                answerError: "* Answer Is Required"
            })
        }
        else {
            valid = true;
            this.setState({
                answerError: ''
            })
        }
        this.setState({
            answer: ans
        })
        return valid;
    }

    validation = () => {
        let valid = false;

        let isEmailValid = this.handleEmailAddress(this.state.emailAddress);
        let isAnswerValid = this.handleAnswer(this.state.answer);
        let isSelectionValid = this.handleSeletedValue(this.state.selectId);

        if (!isEmailValid) {
            valid = false;
        }
        else if (!isAnswerValid) {
            valid = false;
        }
        else if (!isSelectionValid) {
            valid = false;
        }
        else {
            valid = true;
        }
        return valid;
    }

    submitDetail() {
        let valid = this.validation();

        if (valid) {
            fetch(url + "forgetpass/" + this.state.emailAddress + "/" + this.state.selectId + "/" + this.state.answer, {
                method: 'GET'
            })
                .then(res => {
                    console.log(res.status);
                    if (res.status === 200) {
                        localStorage.setItem("emailAddress", this.state.emailAddress);
                        this.props.history.push("/reset-pass");
                    }
                    else {
                        this.growl.show({ severity: 'error', summary: 'Error Message', detail: 'Email Address or Security Question or Answer Might Be InCorrect', life: 5000 });
                    }
                })
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="container pt-5 mt-5">
                    <div className="row m-1">
                        <label htmlFor="EmailAddress">Email Address</label>
                    </div>
                    <div className="row">
                        <div className="col-sm-3">
                            <input type="text" className="form-control" placeholder="Email Address"
                                onChange={(e) => this.handleEmailAddress(e.target.value)} value={this.state.emailAddress} />
                            <span style={this.spanStyle}>{this.state.emailError}</span>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col">
                            <label htmlFor="SelectQuestion">Select Security Question</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-3">
                            <select name="questions" id=""
                                value={this.state.selectId}
                                onChange={(e) => this.handleSeletedValue(e.target.value)}
                                className="form-control">
                                <option value="">Select Security Question</option>
                                {
                                    this.state.securityQuestions.map(question => {
                                        return (
                                            <option value={question.sq_id} key={question.sq_id}>
                                                {question.sq_question}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                            <span style={this.spanStyle}>{this.state.selectionError}</span>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col">
                            <label htmlFor="Answer">Answer</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-3">
                            <input type="text" className="form-control" placeholder="Answer"
                                onChange={(e) => this.handleAnswer(e.target.value)} value={this.state.answer} />
                            <span style={this.spanStyle}>{this.state.answerError}</span>
                        </div>
                    </div>
                    <br />
                    <div className="row m-1">
                        <button className="btn btn-primary" onClick={this.submitDetail}>Submit</button>
                    </div>
                </div>
                <Growl ref={(el) => this.growl = el} position="topright" className="mt-5" />
            </React.Fragment>
        );
    }
}

export default PasswordForget;