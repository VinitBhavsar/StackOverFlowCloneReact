import React, { Component } from 'react';
import { url } from '../App';
import ProfileNav from '../Components/ProfileNav';

class ViewProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileDetails: [],
            profileFirstname: '',
            profileLastname: '',
            profileImage: ''
        }
    }
    componentDidMount() {
        this.getProfileDetails();
        this.getProfileQuestionsDetails();
        this.getProfileAnswersDetails();
    }

    getProfileDetails() {
        fetch(url + "getProfileDetails/" + this.props.match.params.profileId)
            .then(res => {
                return res.json();
            })
            .then(result => {
                console.log(result)
                this.setState({
                    profileDetails: result,
                    profileFirstname: result[0].firstName,
                    profileLastname: result[0].lastName,
                    profileImage: result[0].imageName,
                    profileRep: result[0].user_rep,
                })
            })
            .catch(err => {
                return err
            })
    }

    getProfileQuestionsDetails() {
        fetch(url + "getQuestionsByProfileId/" + this.props.match.params.profileId)
            .then(res => {
                return res.json();
            })
            .then(result => {
                console.log(result.length);
                sessionStorage.setItem("profileQuestions", result.length)
            })
    }

    getProfileAnswersDetails() {
        fetch(url + "getAnswersOfProfileId/" + this.props.match.params.profileId)
            .then(res => {
                return res.json();
            })
            .then(result => {
                sessionStorage.setItem("profileAnswers", result.length)
            })
            .catch(err => {
                return err
            })
    }

    render() {
        document.title = "QnA | User " + this.state.profileFirstname + " " + this.state.profileLastname
        if (this.state.profileDetails.length === 0) {
            return <React.Fragment>
                <div className="pt-5 text-center">
                    No User Found
                </div>
            </React.Fragment>
        }
        return (
            <React.Fragment>
                <br />
                <ProfileNav profileId={this.props.match.params.profileId} />
                <div className="container">
                    <div className="row m-2">
                        <div className="col-sm-5">
                            <div className="card"
                                style={{ width: "14rem", height: "18rem", border: "2px solid opacity 0.5", backgroundColor: "#d6d9dc" }}>
                                <div className="card-body">
                                    <img className="card-img" src={this.state.profileImage !== null ?
                                        `http://{YourLocalHostAddress}/Images/${this.state.profileImage}` : "/images/hMDvl.jpg"
                                    } alt="Profile Pic" width="128" height="128"
                                        style={{ width: 128, marginLeft: 15, marginTop: 13, border: "1px solid dark" }} />
                                </div>
                                <div className="card-footer">
                                    <h5 className="card-title text-center">{this.state.profileFirstname + " " + this.state.profileLastname}</h5>
                                    <p className="card-title text-center"><strong>{this.state.profileRep}</strong> REPUTATIONS</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <h4>{this.state.profileFirstname + " " + this.state.profileLastname}</h4>
                            <br />
                            Total Questions Posted : {
                                Number(sessionStorage.getItem("profileQuestions")) === 0 ? " No Questions Posted Yet By User" : Number(sessionStorage.getItem("profileQuestions"))}
                            <br />
                            <br />
                            Total Answers Posted : {
                                Number(sessionStorage.getItem("profileAnswers")) === 0 ? " No Answers Posted Yet By User" : Number(sessionStorage.getItem("profileAnswers"))}
                            <br />
                            <br />
                            Badges :
                            <br />
                            <br />
                            {Number(this.state.profileRep) === 0 ? "No Badges Earned" :
                                Number(this.state.profileRep) >= 150 && Number(this.state.profileRep) < 250 ? <React.Fragment>
                                    <span className="badge" style={{ backgroundColor: "#cd7f32" }}> <i className="fa fa-certificate" style={{ color: "Blue" }} /> Bronze</span>
                                </React.Fragment>
                                    : Number(this.state.profileRep) >= 250 && Number(this.state.profileRep) < 400 ? <React.Fragment>
                                        <span className="badge" style={{ backgroundColor: "FFDF00" }}> <i className="fa fa-certificate" style={{ color: "Blue" }} /> Silver</span>
                                    </React.Fragment> : Number(this.state.profileRep) >= 400 ? <React.Fragment>
                                        <span className="badge" style={{ backgroundColor: "#FFDF00" }}> <i className="fa fa-certificate" style={{ color: "Blue" }} /> Gold</span>
                                    </React.Fragment> : ""}
                            <br />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ViewProfile;