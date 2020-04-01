import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { url } from '../App';
import ReactPaginate from 'react-paginate';

class MostAnswered extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            searchString: '',
            unAnswerLength: [],
            perPage: 8,
            offset: 0
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        document.title = "QnA | Most Answered"
        this.getMostAnsweredQuestions();
    }

    getMostAnsweredQuestions() {
        fetch(url + "getMostAnsweredQuestion/" + this.state.perPage + "/" + this.state.offset)
            .then(res => {
                return res.json();
            })
            .then(result => {
                this.setState({
                    questions: result
                })
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
            this.getMostAnsweredQuestions();
        });
    };

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
                <div className="container p-5 ">
                    <div className="row">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="pi pi-search"></i></span>
                            </div>
                            <input type="text" className="form-control" placeholder="Search Question"
                                value={this.state.searchString} ref="search" onChange={this.handleChange} />
                        </div>
                    </div>
                    <br />
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <Link className="nav-link" to="/mostAnswered">Most Answer {sessionStorage.getItem("mostAnswerCount")}</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/unAnswered">Unanswered {sessionStorage.getItem("unAnswerCount")}</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/mostLiked">Most Liked {sessionStorage.getItem("mostLiked")}</Link>
                        </li>
                    </ul>
                    <br />
                    <div className="row m-5">
                        {
                            que.length === 0 ? <div className="col-sm-12 text-center">
                                <h4>List Ended</h4>
                            </div> :
                                que.map(question => (
                                    <div className="col-sm-12" key={question.question_id}>
                                        <div key={question.question_id}>
                                            <Link to={`/question/${question.question_id}`}>
                                                <div className="card bg-white mb-3">
                                                    <div className="card-header">
                                                        <b>Answers: {question.answer_count}</b>
                                                    </div>
                                                    <div className="card-body">
                                                        <h4 className="card-title">{question.question}</h4>
                                                        <p className="card-text">{question.description}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                        }
                    </div>
                    {
                        Number(sessionStorage.getItem("mostAnswerCount")) <= 8 ? "" :
                            this.state.questions.length === 0 ? "" :
                                <div className="row m-5 float-right">
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
            </React.Fragment>
        );
    }
}

export default MostAnswered;