import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { Growl } from 'primereact/growl';
import { url } from '../App';
import { Link } from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailAddress: '', emailError: '',
            password: '', passError: '',
            user_id: '',
            users: [],
            firstname: '',
            lastname: '',
        }
        this.spanStyle = {
            color: 'red'
        }
    }

    componentDidMount() {
        document.title = "QnA | Login"
        let userid = localStorage.getItem('userid');
        if (userid) {
            this.props.history.push('/home');
        }
        if (localStorage.getItem("passwordReset") !== null) {
            localStorage.removeItem("passwordReset");
            this.growl.show({ severity: 'success', summary: 'Success Message', detail: 'Password Has Been Reset' });
        }
    }
    setEmailAddress = (value) => {
        let emailAddress = value;
        // eslint-disable-next-line no-useless-escape
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let valid = false;

        if (emailAddress === '') {
            valid = false;
            this.setState({
                emailError: '* Email Address Required'
            })
        }
        else if (!reg.test(emailAddress)) {
            valid = false;
            this.setState({
                emailError: 'Not Valid'
            })
        }
        else {
            this.setState({
                emailError: ''
            })
            valid = true;
        }
        this.setState({
            emailAddress: emailAddress
        })
        return valid;
    }

    setPassword = (value) => {
        let password = value;
        let valid = false;

        if (password === '') {
            valid = false;
            this.setState({
                passError: '* Password Required'
            })
        }
        else {
            this.setState({
                passError: ''
            })
            valid = true;
        }
        this.setState({
            password: password
        });
        return valid;
    }

    validation = () => {
        let valid = false;
        let isEmailValid = this.setEmailAddress(this.state.emailAddress);
        let isPasswordValid = this.setPassword(this.state.password);

        if (!isEmailValid) {
            valid = false;
        }
        else if (!isPasswordValid) {
            valid = false;
        }
        else {
            valid = true;
        }

        return valid;
    }

    handleLogin = () => {
        let emailAddress = this.state.emailAddress;
        let password = this.state.password;
        let valid = this.validation();

        if (valid) {
            fetch(url + "login/" + emailAddress + "/" + password)
                .then(res => {
                    return (
                        res.json()
                    )
                })
                .then(result => {
                    console.log(result);
                    this.setState({
                        users: result,
                    })
                    if (this.state.users.length !== 0) {
                        this.setState({
                            user_id: result[0].user_id,
                            firstname: result[0].firstName,
                            lastname: result[0].lastName,
                        })
                        console.log(this.state.user_id);
                        sessionStorage.setItem('firstname', this.state.firstname);
                        sessionStorage.setItem('lastname', this.state.lastname);
                        sessionStorage.setItem('userid', this.state.user_id);
                        sessionStorage.setItem('loggedin', true);
                        this.props.history.push("/");
                    }
                    else {
                        this.growl.show({ severity: 'error', summary: 'Error Message', detail: 'No User Found' });
                    }
                });
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="login">
                    <div className="app flex-row align-items-center">
                        <Container>
                            <Row className="justify-content-center">
                                <Col md="4">
                                    <Card className="p-6">
                                        <CardBody>
                                            <h1>Login</h1>
                                            <p className="text-muted">Sign In to your account</p>

                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="pi pi-user"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="text" placeholder="Email Address" autoComplete="emailAddress"
                                                    value={this.state.emailAddress} onChange={(e) => this.setEmailAddress(e.target.value)} />
                                            </InputGroup>
                                            <span style={this.spanStyle}>{this.state.emailError}</span>
                                            <InputGroup className="mb-4">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="pi pi-lock"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="password" placeholder="Password" autoComplete="current-password"
                                                    value={this.state.password} onChange={(e) => this.setPassword(e.target.value)} />
                                            </InputGroup>
                                            <span style={this.spanStyle}>{this.state.passError}</span>
                                            <Row>
                                                <div className="text-center">
                                                    <Col xs="6">
                                                        <Button color="primary" className="px-4" type="submit" onClick={() => this.handleLogin()}>Login</Button>
                                                    </Col>
                                                </div>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                    <div className="text-center">
                                        Don't Have An Account?  <Link to="/signup">Sign Up</Link>
                                        <br />
                                        <Link to="/forget-password">Forget Password?</Link>
                                    </div>
                                    <div className="text-center">

                                    </div>
                                </Col>
                            </Row>
                            <Growl ref={(el) => this.growl = el} className="mt-5" />
                        </Container>

                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Login;