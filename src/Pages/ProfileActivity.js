import React, { Component } from 'react';
import ProfileNav from '../Components/ProfileNav';
import { Link } from 'react-router-dom';
import { url } from '../App';

class ProfileActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionsList: [],
            answersList: [],
            showQuestions: 5,
            showAnswers: 5,
            queMore: true,
            ansMore: true
        }
    }

    componentDidMount() {
        this.getProfileQuestionsDetails();
        this.getProfileAnswersDetails();
    }

    getProfileQuestionsDetails() {
        fetch(url + "getQuestionsByProfileId/" + this.props.match.params.profileId)
            .then(res => {
                return res.json();
            })
            .then(result => {
                console.log(result);
                this.setState({
                    questionsList: result
                })
            })
    }

    getProfileAnswersDetails() {
        fetch(url + "getAnswersOfProfileId/" + this.props.match.params.profileId)
            .then(res => {
                return res.json();
            })
            .then(result => {
                console.log(result);
                this.setState({
                    answersList: result
                })
            })
            .catch(err => {
                return err;
            })
    }

    render() {
        return (
            <React.Fragment>
                <br />
                <ProfileNav profileId={this.props.match.params.profileId} />
                <div className="container">
                    <strong>Questions ({this.state.questionsList.length})</strong>
                    <hr className="my-2" />
                </div>
                <div className="container">
                    {
                        this.state.questionsList.slice(0, this.state.showQuestions).map(questions => (
                            <React.Fragment>
                                <Link to={`/question/${questions.question_id}`}>
                                    <div className="col-sm-12">
                                        <div className="card my-1">
                                            <div className="card-body">
                                                <h4>{questions.question}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </React.Fragment>
                        ))
                    }
                    <br />
                    {
                        this.state.questionsList.length <= 5 ? "" :
                            this.state.queMore === true ?
                                <Link to={`/${this.props.match.params.profileId}/questions`}>
                                    View More >>>
                                </Link> : ""
                    }
                </div>
                <br />
                <div className="container">
                    <strong>Answers ({this.state.answersList.length})</strong>
                    <hr className="my-2" />
                </div>
                <div className="container">
                    {
                        this.state.answersList.slice(0, this.state.showAnswers).map(answers => (
                            <React.Fragment>
                                <Link to={`/question/${answers.question_id}`}>
                                    <div className="col-sm-12">
                                        <div className="card my-2">
                                            <div className="card-body">
                                                <h4>{answers.answer}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </React.Fragment>
                        ))
                    }
                    <br />
                    {
                        this.state.answersList.length < 5 ? "" :
                            this.state.ansMore === true ?
                                <Link to={`/${this.props.match.params.profileId}/answers`}>
                                    View More >>>
                                    </Link> : ""
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default ProfileActivity;