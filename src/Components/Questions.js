import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { url } from '../App';
import Moment from 'react-moment';
import { Growl } from 'primereact/growl';

class Questions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            searchString: '',
            perPage: 8,
            offset: 0
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        document.title = "QnA"
        if (sessionStorage.getItem("loggedin") !== null) {
            sessionStorage.removeItem("loggedin");
            this.growl.show({ severity: 'success', summary: 'Success Message', detail: 'Logged In' });
        }
        if (localStorage.getItem("deletestatus") !== null) {
            localStorage.removeItem("deletestatus")
            this.growl.show({
                life: 2000, severity: 'error', summary: 'Success Message',
                detail: 'Your Account Has Been Deleted Permanently'
            });
        }
        this.getAllQuestion();
        this.getMostAnsweredQuestions();
        this.getUnAnsweredQuestion();
        this.getMostLikedQuestion();
    }

    getAllQuestion() {
        fetch(url + "getAllQuestions/" + this.state.perPage + "/" + this.state.offset)
            .then(res => {
                return res.json();
            })
            .then(data => {
                this.setState({
                    questions: data,
                })
            })
            .catch(error => console.log(error))
    }

    getMostAnsweredQuestions() {
        fetch(url + "getMostAnsweredQuestion")
            .then(res => {
                return res.json();
            })
            .then(result => {
                sessionStorage.setItem("mostAnswerCount", result.length)
            })
    }

    getUnAnsweredQuestion() {
        fetch(url + "getUnAnsweredQuestion")
            .then(res => {
                return res.json();
            })
            .then(result => {
                sessionStorage.setItem("unAnswerCount", result.length)
            })
    }

    getMostLikedQuestion() {
        fetch(url + "getMostLikedQuestions")
            .then(res => {
                return res.json();
            })
            .then(result => {
                sessionStorage.setItem("mostLiked", result.length)
            })
    }

    handleChange() {
        this.setState({
            searchString: this.refs.search.value
        });
    }

    handlePageClick = data => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);

        this.setState({ offset: offset }, () => {
            this.getAllQuestion();
        });
    };

    setSession(value) {
        sessionStorage.setItem("questionId", value)
    }
    
    render() {
        let que = this.state.questions;
        let search = this.state.searchString.trim().toLowerCase();

        if (search.length > 0) {
            que = que.filter(function (ques) {
                return ques.question.toLowerCase().match(search);
            });
        }
        return (
            <React.Fragment>
                <br />
                <div className="container p-5 mt-5">
                    <div className="row">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="pi pi-search"></i></span>
                            </div>
                            <input type="text" className="form-control" placeholder="Search Question"
                                value={this.state.searchString} ref="search" onChange={this.handleChange} /> &nbsp;
                            <Link className="btn btn-primary float-right" to="/create-question">Ask Question</Link>
                        </div>
                    </div>
                    <br />
                    <ul className="nav nav-tabs">
                        <li className="nav-item border">
                            <Link className="nav-link" to="/mostAnswered">Most Answer {sessionStorage.getItem("mostAnswerCount")}</Link>
                        </li>
                        <li className="nav-item border">
                            <Link className="nav-link" to="/unAnswered">Unanswered {sessionStorage.getItem("unAnswerCount")}</Link>
                        </li>
                        <li className="nav-item border">
                            <Link className="nav-link" to="/mostLiked">Most Liked {sessionStorage.getItem("mostLiked")}</Link>
                        </li>
                    </ul>
                    <br />
                    <div className="row m-1">
                        {
                            this.state.questions.length === 0 ? "No More Questions Found" :
                                que.map(question => (
                                    <div className="col-sm-12" key={question.question_id}>
                                        <div className="card">
                                            <div className="card-header">
                                                <b>Answers: {question.answer_count}</b>
                                                <p className="card-text float-right">Likes : {question.likes_count} <br /> Dislikes : {question.dislike_count}</p>
                                            </div>
                                            <div className="card-body">
                                                <Link to={`/question/${question.question_id}`}
                                                    onClick={() => this.setSession(question.question_id)}>
                                                    <h4 className="card-title">{question.question}</h4>
                                                </Link>
                                                <p className="card-text">{question.description}</p>
                                            </div>
                                            <div className="card-footer">
                                                <p className="card-text float-right">Asked By : &nbsp;
                                                    {
                                                        question.user_id === 0 ? question.firstName + " " + question.lastName :
                                                            <Link to={`/profile/${question.user_id}`}>
                                                                {question.firstName + " " + question.lastName}
                                                            </Link>
                                                    }
                                                    <br />
                                                    <Moment format="D MMM YYYY">{question.created_date}</Moment> at &nbsp;
                                                            <Moment format="HH:mm">{question.created_date}</Moment>
                                                    <br />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        }
                    </div>
                    {
                        this.state.questions.length === 0 ? "" : <div className="row m-2 float-right">
                            <div className="react-paginate ul li">
                                <ReactPaginate
                                    previousLabel={'previous'}
                                    nextLabel={'next'}
                                    breakLabel={'...'}
                                    breakClassName={'break-me'}
                                    pageCount={15}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={2}
                                    onPageChange={this.handlePageClick}
                                    containerClassName={'pagination'}
                                    subContainerClassName={'pages pagination'}
                                    activeClassName={'active'}
                                />
                            </div>
                        </div>
                    }
                </div>
                <Growl ref={(el) => this.growl = el} className="mt-5" />
            </React.Fragment>
        );
    }
}

export default Questions;