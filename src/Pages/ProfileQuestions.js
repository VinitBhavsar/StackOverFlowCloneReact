import React, { Component } from 'react';
import { url } from '../App';
import { Link } from 'react-router-dom';
import ProfileNav from '../Components/ProfileNav';
import Moment from 'react-moment';

class ProfileQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileQuestionList: []
        }
    }

    componentDidMount() {
        this.getAllQuestionsOfProfile();
    }

    getAllQuestionsOfProfile() {
        fetch(url + "getQuestionsByProfileId/" + this.props.match.params.profileId, {
            method: 'GET'
        })
            .then(res => {
                console.log(res);
                return res.json();
            })
            .then(result => {
                console.log(result);
                this.setState({
                    profileQuestionList: result
                })
            })
    }
    render() {
        return (
            <React.Fragment>
                <ProfileNav profileId={this.props.match.params.profileId} />

                <div className="container">
                    <p><strong>Questions</strong></p>
                    {
                        this.state.profileQuestionList.map(questions => (
                            <React.Fragment>
                                <Link to={`/question/${questions.question_id}`}>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="card">
                                                <div className="card-body">
                                                    {questions.question}
                                                    <div className="float-right">
                                                        <Moment format="D MMM YYYY">{questions.create_date}</Moment> at &nbsp;
                                                        <Moment format="HH:mm">{questions.create_date}</Moment>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </React.Fragment>
                        ))
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default ProfileQuestions;