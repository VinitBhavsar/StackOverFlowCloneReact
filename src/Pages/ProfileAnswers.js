import React, { Component } from 'react';
import { url } from '../App';
import { Link } from 'react-router-dom';
import ProfileNav from '../Components/ProfileNav';

class ProfileAnswers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileAnswerList: []
        }
    }

    componentDidMount() {
        this.getAllAnswersOfProfile();
    }

    getAllAnswersOfProfile() {
        fetch(url + "getAnswersOfProfileId/" + this.props.match.params.profileId, {
            method: 'GET'
        })
            .then(res => {
                console.log(res);
                return res.json();
            })
            .then(result => {
                console.log(result);
                this.setState({
                    profileAnswerList: result
                })
            })
    }

    render() {
        return (
            <React.Fragment>
                <ProfileNav profileId={this.props.match.params.profileId} />
                <div className="container">
                    {
                        this.state.profileAnswerList.map(answers => (
                            <React.Fragment>
                                <Link to={`/question/${answers.question_id}`}>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="card">
                                                <div className="card-body">
                                                    {answers.answer}
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

export default ProfileAnswers;