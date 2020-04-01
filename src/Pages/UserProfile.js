import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { url } from '../App';
import ReactPaginate from 'react-paginate';

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionByuid: [],
            perPage: 10,
            offset: 0
        }
    }

    componentDidMount() {
        document.title = "QnA | " + sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname")
        console.log(sessionStorage.getItem("userid"));
        let user_id = sessionStorage.getItem("userid");

        if (user_id === null) {
            this.props.history.push("/login");
        }
        else {
            this.getAllQuestionByUid();
        }
    }

    getAllQuestionByUid() {
        fetch(url + "/getAllQuestionByUid/" + sessionStorage.getItem("userid") + "/" + this.state.perPage + "/" + this.state.offset)
            .then(res => {
                return res.json();
            })
            .then(result => {
                console.log(result);
                this.setState({
                    questionByuid: result
                })
            })
    }

    handlePageClick = data => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);

        this.setState({ offset: offset }, () => {
            this.getAllQuestionByUid();
        });
    };

    render() {
        return (
            <React.Fragment>
                <div className="Questions">
                    <div className="container mt-5">
                        <div className="row float-right m-1">
                            <Link to="/create-question" className="btn btn-primary float-right">Ask New Question</Link>
                        </div>
                        <br /><br />
                        <br />
                        <div className="row">
                            {
                                this.state.questionByuid.length === 0 ? <React.Fragment>
                                    <p>No Question Posted Yet</p>
                                </React.Fragment> :
                                    this.state.questionByuid.map(question => (
                                        <div key={question.question_id} className="col-sm-12">
                                            <Link to={`/question/${question.question_id}`}>
                                                <div className="card">
                                                    <div className="card-header">
                                                        <b>Answers: {question.answer_count}</b><br />
                                                        <b>Likes : {question.likes_count}</b>
                                                    </div>
                                                    <div className="card-body">
                                                        <h4 className="card-title">{question.question}</h4>
                                                        <p className="card-text">{question.description}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                            }
                        </div>
                        {
                            this.state.questionByuid.length === 0 ? "" : this.state.questionByuid.length > 10 ?
                                <div className="row m-2 float-right">
                                    <div className="react-paginate ul li">
                                        <ReactPaginate
                                            previousLabel={'previous'}
                                            nextLabel={'next'}
                                            breakLabel={'...'}
                                            breakClassName={'break-me'}
                                            pageCount={this.state.pageCount}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={2}
                                            onPageChange={this.handlePageClick}
                                            containerClassName={'pagination'}
                                            subContainerClassName={'pages pagination'}
                                            activeClassName={'active'}
                                        />
                                    </div>
                                </div> : ""
                        }

                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default UserProfile;