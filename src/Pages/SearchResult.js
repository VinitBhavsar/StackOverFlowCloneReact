import React, { Component } from 'react';
import { url } from '../App';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchList: [],
            searchListLength: '',
            perPage: 5,
            offset: 0
        }
    }

    componentDidMount() {
        document.title = "QnA | Searched Results"
        this.searchQuestion();
        this.getLength();
    }

    getLength() {
        fetch(url + "searchedQuestion/" + this.props.match.params.question)
            .then(res => {
                return res.json();
            })
            .then(result => {
                this.setState({
                    searchListLength: result.length
                })
            })
            .catch(err => { return err })
    }

    searchQuestion() {
        fetch(url + "searchedQuestion/" + this.props.match.params.question + "/" + this.state.perPage + "/" + this.state.offset)
            .then(response => {
                return response.json();
            })
            .then(result => {
                console.log(result);
                if (result.length !== 0) {
                    this.setState({
                        searchList: result
                    })
                }
                else {
                    this.setState({
                        searchList: null
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    handlePageClick = data => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);

        this.setState({ offset: offset }, () => {
            this.searchQuestion();
        });
    };


    render() {
        return (
            <React.Fragment>
                <br />
                <div className="container p-5">
                    <div className="row">

                    </div>
                    <div className="row m-1">
                        <h4>{this.state.searchListLength} Results</h4>
                    </div>
                    <br />
                    <div className="row">
                        {
                            this.state.searchList.length === 0 ? <p>No Question Found</p> :
                                this.state.searchList !== null ?
                                    this.state.searchList.map(question => (
                                        this.state.searchList.length === 0 ? <div>List Ended</div> :
                                            <div key={question.question_id} className="col-sm-12">
                                                <Link to={`/question/${question.question_id}`}>
                                                    <div className="card bg-white">
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
                                    )) : ""
                        }
                    </div>
                    {
                        this.state.searchListLength === 0 ? "" : this.state.searchListLength < 5 ? "" :
                            this.state.searchList === null ? "" :
                                <div className="row mr-1 float-right">
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

export default SearchResult