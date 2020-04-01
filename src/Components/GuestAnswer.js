import React, { Component } from 'react';

class GuestAnswer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answer: '',
            queid: '',
            fname: '',
            fnameError: '',
            lname: '',
            lnameError: '',
            answerError: ''
        }
        this.spanStyle = {
            color: 'red'
        }

        this.handleGustFname = this.handleGustFname.bind(this);
        this.handleGustLname = this.handleGustLname.bind(this);
    }

    handleGustFname(value) {
        let firstName = value;
        let reg = /^[a-zA-Z]*$/;
        let valid = false;

        if (firstName === '') {
            valid = false;
            this.setState({
                fnameError: '* First Name Is Required'
            })
        }
        else if (!reg.test(firstName)) {
            valid = false;
            this.setState({
                fnameError: 'Not Valid Formate'
            })
        }
        else {
            valid = true;
            this.setState({
                fnameError: '',
            })
        }
        this.setState({
            fname: firstName
        })
        return valid;
    }

    handleGustLname(value) {
        let lastName = value;
        let reg = /^[a-zA-Z]*$/;
        let valid = false;

        if (lastName === '') {
            this.setState({
                lnameError: '* Last Name Is Required'
            })
            valid = false;
        }
        else if (!reg.test(lastName)) {
            this.setState({
                lnameError: 'Not Valid Formate'
            })
            valid = false;
        }
        else {
            this.setState({
                lnameError: '',
            })
            valid = true;
        }
        this.setState({
            lname: lastName
        })
        return valid;
    }

    updateAnswer(value) {
        let answer = value;
        let valid = false;

        if (answer === '') {
            this.setState({
                answerError: '* Answer Can not Be Null'
            })
            valid = false;
        }
        else {
            this.setState({
                answerError: '',
            })
            valid = true;
        }
        this.setState({
            answer: answer,
        })
        return valid;
    }

    validation = () => {
        let valid = false;

        let isAnswerValid = this.updateAnswer(this.state.answer);
        let isFnameValid = this.handleGustFname(this.state.fname);
        let isLnameValid = this.handleGustLname(this.state.lname);

        if (!isFnameValid) {
            valid = false;
        }
        else if (!isLnameValid) {
            valid = false;
        }
        else if (!isAnswerValid) {
            valid = false;
        }
        else {
            valid = true;
        }
        return valid;
    }

    submit() {

        let valid = this.validation();

        if (valid) {
            this.props.submitAnswer(this.state.answer, this.props.questionId, this.state.fname, this.state.lname);
            this.setState({
                answer: '',
                fname: '',
                lname: ''
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                <br />
                <h4>Post answer as a guest</h4>
                <div className="form-group">
                    <textarea
                        type="text" rows="7"
                        onChange={(e) => this.updateAnswer(e.target.value)}
                        className="form-control"
                        placeholder="Share your answer"
                        value={this.state.answer}
                    />
                    <span style={this.spanStyle}>{this.state.answerError}</span>
                </div>

                <div>
                    <div>
                        <label>First Name</label>
                        <div>
                            <input onChange={(e) => this.handleGustFname(e.target.value)} className="form-control col-sm-2"
                                type="text" value={this.state.fname} placeholder="First Name" />
                            <span style={this.spanStyle}>{this.state.fnameError}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <label>Last Name</label>
                    </div>
                    <div>
                        <input className="form-control col-sm-2" type="text" value={this.state.lname}
                            onChange={(e) => this.handleGustLname(e.target.value)} placeholder="Last Name" />
                        <span style={this.spanStyle}>{this.state.lnameError}</span>
                    </div>
                </div>
                <br />
                <button
                    className="btn btn-primary"
                    onClick={() => { this.submit() }}>
                    Submit
        </button>
            </React.Fragment>
        );
    }
}

export default GuestAnswer;