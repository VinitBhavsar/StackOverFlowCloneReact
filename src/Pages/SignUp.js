import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { url } from '../App';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '', fnameError: '',
            lastName: '', lnameError: '',
            emailAddress: '', emailError: '',
            password: '', passError: '',
            repeatPassword: '', repeatPassError: '',
            securityQuestions: [],
            answer: '', answerError: '',
            selectId: '', selectionError: '',
            passMatch: 0,
            emailValid: false
        }

        this.spanStyle = {
            color: 'red'
        }

        //Method Binding
        this.handleFname = this.handleFname.bind(this);
        this.handleLname = this.handleLname.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleRepeatPass = this.handleRepeatPass.bind(this);
        this.signUp = this.signUp.bind(this);
    }

    componentDidMount() {
        document.title = "QnA | Sign up"
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

    handleFname(value) {
        let fname = value;
        let reg = /^[a-zA-Z]*$/;
        let valid = false;

        if (fname === '') {
            valid = false;
            this.setState({
                fnameError: '* first name is required'
            })
        }
        else if (!reg.test(fname)) {
            valid = false;
            this.setState({
                fnameError: '* Please Enter Only Alphbets'
            })
        }
        else {
            valid = true;
            this.setState({
                fnameError: ''
            })
        }
        this.setState({
            firstName: fname
        })
        return valid;
    }

    handleLname(value) {
        let lname = value;
        let reg = /^[a-zA-Z]*$/;
        let valid = false;

        if (lname === '') {
            valid = false;
            this.setState({
                lnameError: '* last name is required'
            })
        }
        else if (!reg.test(lname)) {
            valid = false;
            this.setState({
                lnameError: '* Please Enter Only Alphbets'
            })
        }
        else {
            valid = true;
            this.setState({
                lnameError: ''
            })
        }
        this.setState({
            lastName: lname
        })
        return valid;
    }

    handleEmail(value) {
        debugger
        let email = value;
        // eslint-disable-next-line no-useless-escape
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;;
        let valid = false;

        if (email === '') {
            valid = false;
            this.setState({
                emailError: '* Email Address Is Required'
            })
        }
        else if (!reg.test(email)) {
            valid = false;
            this.setState({
                emailError: '* Not A Valid Email Address'
            })
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

    checkEmailAddress(value) {
        debugger
        fetch(url + "checkEmailRegistered/" + value)
            .then(res => {
                console.log(res.status)
                if (res.status === 409) {
                    this.setState({
                        emailError: 'Email Already Registered'
                    })
                }
                else {
                    this.setState({
                        emailError: '',
                        emailValid: true
                    })
                }
            })

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

    handlePassword(value) {
        let pass = value;
        let valid = false;

        if (pass === '') {
            valid = false;
            this.setState({
                passError: '* Password Is Required'
            })
        }
        else if (pass.length < 8) {
            valid = false;
            this.setState({
                passError: '* To Short Password'
            })
        }
        else {
            valid = true;
            this.setState({
                passError: ''
            })
        }
        this.setState({
            password: pass
        })
        return valid;
    }

    handleRepeatPass(value) {
        let repeatPass = value;
        let valid = false;

        if (repeatPass === '') {
            valid = false;
            this.setState({
                repeatPassError: '* Re-enter your password',
                passMatch: 0
            })
        }
        else if (repeatPass !== this.state.password) {
            valid = false;
            this.setState({
                repeatPassError: '* Password Does Not Match',
                passMatch: 0
            })
        }
        else if (repeatPass === this.state.password) {
            valid = true;
            this.setState({
                passMatch: 1,
                repeatPassError: ''
            })
        }
        else {
            valid = true;
            this.setState({
                repeatPassError: ''
            })
        }
        this.setState({
            repeatPassword: repeatPass
        })
        return valid;
    }

    validation = () => {
        debugger
        let valid = false;

        let isFnameValid = this.handleFname(this.state.firstName);
        let isLnameValid = this.handleLname(this.state.lastName);
        let isEmailValid = this.handleEmail(this.state.emailAddress);
        let isAnswerValid = this.handleAnswer(this.state.answer);
        let isSelectionValid = this.handleSeletedValue(this.state.selectId);
        let isPassValid = this.handlePassword(this.state.password);
        let isRepeatPassValid = this.handleRepeatPass(this.state.repeatPassword);

        if (!isFnameValid) {
            valid = false;
        }
        else if (!isLnameValid) {
            valid = false;
        }
        else if (!isEmailValid) {
            valid = false;
        }
        else if (!isSelectionValid) {
            valid = false;
        }
        else if (!isAnswerValid) {
            valid = false;
        }
        else if (!isPassValid) {
            valid = false;
        }
        else if (!isRepeatPassValid) {
            valid = false;
        }
        else {
            valid = true;
        }
        return valid;
    }

    signUp() {
        debugger
        let valid = this.validation();

        if (valid) {
            if (this.state.emailValid === true) {
                let data = {
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    emailAddress: this.state.emailAddress,
                    password: this.state.password,
                    sq_id: this.state.selectId,
                    sq_answer: this.state.answer
                }

                fetch(url + "/signup", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                    .then(res => {
                        console.log(res.status);
                        console.log(res.url);
                        if (res.status === 200) {
                            this.props.history.push("/login");
                        }
                    })
            }
            else {

            }
        }
        else {
            alert("Not Valid");
        }
    }
    render() {
        return (
            <React.Fragment>
                <div className="app flex-row align-items-center">
                    <Container>
                        <Row className="justify-content-center">
                            <p style={{ fontSize: 22 }}>
                                Create your account.
                                It’s free and only takes a minute.
                            </p>
                        </Row>
                        <br />
                        <Row className="justify-content-center">
                            <Col md="9" lg="7" xl="6">
                                <Card className="mx-4">
                                    <CardBody className="p-4">
                                        <Form>
                                            <h2>Register</h2>
                                            <p className="text-muted">Create your account</p>
                                            <span style={this.spanStyle}>{this.state.fnameError}</span>
                                            <InputGroup className="mb-3">
                                                <Input type="text" placeholder="First Name" value={this.state.firstName}
                                                    onChange={(e) => this.handleFname(e.target.value)} autoComplete="username" />
                                            </InputGroup>
                                            <span style={this.spanStyle}>{this.state.lnameError}</span>
                                            <InputGroup className="mb-3">
                                                <Input type="text" placeholder="Last Name" value={this.state.lastName}
                                                    onChange={(e) => this.handleLname(e.target.value)} autoComplete="username" />
                                            </InputGroup>
                                            <span style={this.spanStyle}>{this.state.emailError}</span>
                                            <InputGroup className="mb-3">
                                                <Input type="text" placeholder="Email Address" value={this.state.emailAddress}
                                                    onChange={(e) => this.handleEmail(e.target.value)} autoComplete="email"
                                                    onBlur={(e) => this.checkEmailAddress(e.target.value)} />
                                            </InputGroup>
                                            <span style={this.spanStyle}>{this.state.selectionError}</span>
                                            <InputGroup className="mb-4">
                                                <Input type="select" name="select" id=""
                                                    value={this.state.selectId}
                                                    onChange={(e) => this.handleSeletedValue(e.target.value)}
                                                >
                                                    <option value="">Please select Security Question</option>
                                                    {
                                                        this.state.securityQuestions.map(question => {
                                                            return (
                                                                <option value={question.sq_id} key={question.sq_id}>
                                                                    {question.sq_question}
                                                                </option>
                                                            )
                                                        })
                                                    }
                                                </Input>
                                            </InputGroup>
                                            <span style={this.spanStyle}>{this.state.answerError}</span>
                                            <InputGroup className="mb-3">
                                                <Input type="text" placeholder="Answer" value={this.state.answer}
                                                    onChange={(e) => this.handleAnswer(e.target.value)} autoComplete="" />
                                            </InputGroup>
                                            <span style={this.spanStyle}>{this.state.passError}</span>
                                            <InputGroup className="mb-3">
                                                <Input type="password" placeholder="Password" value={this.state.password}
                                                    onChange={(e) => this.handlePassword(e.target.value)} maxLength="16"
                                                    minLength="8"
                                                    autoComplete="new-password" />
                                            </InputGroup>
                                            <span style={this.spanStyle}>{this.state.repeatPassError}</span>
                                            <InputGroup className="mb-4">
                                                <Input type="password" style={this.state.passMatch === 1 ? { borderColor: 'green' } : {}}
                                                    placeholder="Repeat password" value={this.state.repeatPassword}
                                                    onChange={(e) => this.handleRepeatPass(e.target.value)} autoComplete="new-password" />
                                            </InputGroup>
                                            <Button color="success" onClick={() => this.signUp()} block>Sign up</Button>
                                        </Form>
                                        <br />
                                        <div class="js-terms fs-caption fc-light ta-left mt32">
                                            By clicking “Sign up”, you agree to our <Link to="https://stackoverflow.com/legal/terms-of-service/public"
                                                className="-link">
                                                terms of service
                                            </Link>,
                                            <Link to="https://stackoverflow.com/legal/privacy-policy" className="-link">
                                                privacy policy
                                            </Link> and <Link to="https://stackoverflow.com/legal/cookie-policy" className="-link">
                                                cookie policy</Link>
                                            <input type="hidden" name="legalLinksShown" value="1" />
                                        </div>
                                    </CardBody>
                                </Card>
                                <div className="text-center">
                                    Already Have An Account?  <Link to="/login">Log in</Link>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default SignUp;