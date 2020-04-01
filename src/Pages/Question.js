import React, { Component } from 'react';
import SubmitAnswer from '../Components/SubmitAnswer';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { url } from '../App';
import GuestAnswer from '../Components/GuestAnswer';
import { Link } from 'react-router-dom';
// import Moment from 'react-moment';

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            details: [],
            questionDetails: [],
            question_id: '',
            question: '', description: '',
            createdBy: '',
            answerList: [],
            questionuid: '',
            editorData: '',
            uid: '', firstName: '', lastName: '',
            editAnswer: false,
            answerid: '', answerEdit: '',
            deleteDialog: false,
            questionDialog: false,
            showMoreAns: 5,
            showMore: true,
            liked: 0, disliked: 0,
            upVote: false, downVote: false,
            vote: 0,
        }

        this.editorChange = this.editorChange.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.getTexBox = this.getTexBox.bind(this);
        this.changeAnswer = this.changeAnswer.bind(this);
        this.updateAnswer = this.updateAnswer.bind(this);
        this.guestAnswer = this.guestAnswer.bind(this);
        this.deleteAnswerDialog = this.deleteAnswerDialog.bind(this);
        this.onHide = this.onHide.bind(this);
        this.deleteQueDialog = this.deleteQueDialog.bind(this);

    }

    componentDidMount() {
        sessionStorage.getItem("questionId", this.props.match.params.questionId)
        this.setState({
            firstName: sessionStorage.getItem("firstname"),
            lastName: sessionStorage.getItem("lastname")
        })
        this.getQuestionDetails();
        this.getAllAnswersByQid();
        if (Number(sessionStorage.getItem("userid")) !== 0) {
            this.getAllLikesOfLoggedUser();
            this.getAllDislikesOfLoggedUser();
        }
    }

    getQuestionDetails() {
        fetch(url + "getQuestionByqid/" + this.props.match.params.questionId)
            .then(response => {
                return response.json();
            })
            .then(result => {
                this.setState({
                    questionDetails: result,
                    question: result[0].question,
                    description: result[0].description,
                    question_id: result[0].question_id,
                    questionuid: result[0].user_id,
                    createdBy: result[0].firstName + " " + result[0].lastName,
                    likes: result[0].like_count,
                    dislike: result[0].dislike_count,
                    createdDate: result[0].created_date
                })
            })
            .catch(err => console.log(err));
    }

    getAllAnswersByQid() {
        fetch(url + "getAnswerByQid/" + this.props.match.params.questionId, {
            method: 'GET'
        })
            .then(res => {
                return res.json();
            })
            .then(result => {
                this.setState({
                    answerList: result
                })
            })
            .catch(err => {
                return err;
            });
    }

    getAllLikesOfLoggedUser() {
        fetch(url + "getAllLikeOfLoggedUser/" + sessionStorage.getItem("userid") + "/" + this.props.match.params.questionId, {
            method: 'GET'
        })
            .then(res => {
                console.log(res.url);
                console.log(res.status);
                if (res.status === 200) {
                    this.setState({
                        liked: 1
                    })
                }
            })
    }

    getAllDislikesOfLoggedUser() {
        fetch(url + "getDislikeOfLoggedUser/" + sessionStorage.getItem("userid") + "/" + this.props.match.params.questionId, {
            method: 'GET'
        })
            .then(res => {
                console.log(res.url);
                console.log(res.status);
                if (res.status === 200) {
                    this.setState({
                        disliked: 1
                    })
                }
            })
    }
    editorChange(e) {
        debugger
        this.setState({
            editorData: e.editor.getData()
        })
    }

    submitAnswer(answer, queid) {
        let data = {
            "question_id": queid,
            "answer": answer,
            "user_id": sessionStorage.getItem("userid"),
            "firstName": sessionStorage.getItem("firstname"),
            "lastName": sessionStorage.getItem("lastname")
        }
        fetch(url + "postAnswer", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        this.getQuestionDetails();
        this.getAllAnswersByQid();
    }

    guestAnswer(answer, queid, fname, lname) {
        let data = {
            "question_id": queid,
            "answer": answer,
            "firstName": fname,
            "lastName": lname
        }
        fetch(url + "postAnswer", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        this.getQuestionDetails();
        this.getAllAnswersByQid();
    }
    submitComment(comment, queid) {
        let data = {
            "question_id": queid,
            "answer": comment,
            "user_id": sessionStorage.getItem("userid"),
            "firstName": sessionStorage.getItem("firstname"),
            "lastName": sessionStorage.getItem("lastname")
        }
        fetch(url + "postAnswer", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        this.getQuestionDetails();
        this.getAllAnswersByQid();
    }

    deleteQuestion() {
        if (this.state.answerList.length === 0) {
            console.log("Hello");
            fetch(url + "deleteQuestion/" + this.props.match.params.questionId, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.status === 200) {
                        this.props.history.push("/my-profile")
                    }
                })
        }
        else {
            fetch(url + "deleteQueAns/" + this.props.match.params.questionId, {
                method: 'DELETE'
            })
                .then(res => {
                    console.log(res.status)
                    if (res.status === 200) {
                        this.props.history.push("/my-profile")
                    }
                })
        }
    }

    changeAnswer(value) {
        this.setState({
            answerEdit: value
        })
    }
    getTexBox(ansId, ansValueById) {
        this.setState({
            editAnswer: true,
            answerid: ansId,
            answerEdit: ansValueById
        })
    }

    updateAnswer(value) {
        let data = {
            answer_id: value,
            answer: this.state.answerEdit
        }
        fetch(url + "updateAnswer", {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(res => {
                console.log(res.status)
                if (res.status === 200) {
                    window.location.reload();
                }
            })
    }
    deleteAnswer(answerid) {
        console.log(answerid);
        fetch(url + "deleteAnswer/" + answerid, {
            method: 'DELETE'
        })
            .then(res => {
                console.log(res.status);
                if (res.status === 200) {
                    window.location.reload();
                }
            })
    }

    deleteAnswerDialog(value) {
        this.setState({
            deleteDialog: true,
            answerid: value
        })
    }

    deleteQueDialog() {
        this.setState({
            questionDialog: true
        })
    }
    onHide() {
        this.setState({
            questionDialog: false,
            deleteDialog: false,
        })
    }

    handleLiked() {
        if (Number(sessionStorage.getItem("userid")) === 0) {
            alert("Only Registered User Have This Feature")
        }
        else {
            if (this.state.disliked === 1) {
                this.setState({
                    disliked: 0, liked: 1
                })
                let data = {
                    user_id: sessionStorage.getItem("userid"),
                    question_id: this.state.question_id,
                    question_userid: this.state.questionuid
                }
                fetch(url + "removeDislike", {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                    .then(res => {
                        console.log(res.status);
                        this.getQuestionDetails();
                        this.getAllLikesOfLoggedUser();
                        this.getAllDislikesOfLoggedUser();
                    })
            }
            if (this.state.liked === 0) {
                this.setState({
                    liked: 1
                })

                let data = {
                    user_id: sessionStorage.getItem("userid"),
                    question_id: this.state.question_id,
                    question_userid: this.state.questionuid
                }
                fetch(url + "likeQuestion", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                    .then(res => {
                        console.log("Like Added " + res.status);
                        this.getQuestionDetails();
                        this.getAllLikesOfLoggedUser();
                    })
                    .catch(err => console.log(err))
            }
            else {
                this.setState({
                    liked: 0
                })
                let data = {
                    user_id: sessionStorage.getItem("userid"),
                    question_id: this.state.question_id,
                    question_userid: this.state.questionuid
                }
                fetch(url + "removeLike", {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                    .then(res => {
                        console.log("Like Removed " + res.status);
                        this.getQuestionDetails();
                        this.getAllLikesOfLoggedUser();
                    })
                    .catch(err => console.log(err))
            }
        }
    }
    handleDisliked() {
        if (Number(sessionStorage.getItem("userid")) === 0) {
            alert("Only Registered User Have This Feature")
        }
        else {
            if (this.state.liked === 1) {
                this.setState({
                    liked: 0, disliked: 1
                })
                let data = {
                    user_id: sessionStorage.getItem("userid"),
                    question_id: this.state.question_id,
                    question_userid: this.state.questionuid
                }
                fetch(url + "removeLike", {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                    .then(res => {
                        console.log("Dislike Cliked And Like Removed " + res.status);
                        this.getQuestionDetails();
                    })
                    .catch(err => console.log(err))
            }
            if (this.state.disliked === 0) {
                this.setState({
                    disliked: 1
                })
                let data = {
                    user_id: sessionStorage.getItem("userid"),
                    question_id: this.state.question_id,
                    question_userid: this.state.questionuid
                }
                fetch(url + "addDislike", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                    .then(res => {
                        console.log(res.status);
                        this.getQuestionDetails();
                    })
                    .catch(err => console.log(err))
            }
            else {
                this.setState({
                    disliked: 0
                })
                let data = {
                    user_id: sessionStorage.getItem("userid"),
                    question_id: this.state.question_id,
                    question_userid: this.state.questionuid
                }
                fetch(url + "removeDislike", {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                    .then(res => {
                        console.log(res.status);
                        this.getQuestionDetails();
                    })
                    .catch(err => console.log(err))
            }
        }
    }

    render() {
        document.title = this.state.question;
        return (
            <React.Fragment>
                <div className="container mt-5">
                    <div className="col-sm-12">
                        <h1 style={{ fontSize: 29 }}>{this.state.question}</h1>
                        {
                            Number(sessionStorage.getItem("userid")) === 0 ? "" :
                                this.state.questionuid === Number(sessionStorage.getItem("userid")) ? "" :
                                    <React.Fragment>
                                        <Link className={this.state.liked === 0 ? "fa fa-thumbs-o-up" : "fa fa-thumbs-up"}
                                            data-toggle="tooltip" title="like"
                                            style={{ fontSize: 20 }} onClick={() => this.handleLiked()}></Link> &nbsp; &nbsp;
                        <Link className={this.state.disliked === 0 ? "fa fa-thumbs-o-down" : "fa fa-thumbs-down"}
                                            data-toggle="tooltip" title="dislike"
                                            style={{ fontSize: 20 }} onClick={() => this.handleDisliked()}></Link>

                                    </React.Fragment>
                        }
                        <hr className="my-3" />
                        <p style={{ fontSize: 19 }}>{this.state.description} </p>
                        {/* Created : <Moment format="DD/MM/YYY">{this.state.created_date}</Moment> */}
                        {
                            Number(sessionStorage.getItem("userid")) === this.state.questionuid ? <p className="float-right"><strong>
                                <i className="fa fa-thumbs-o-up" data-toggle="tooltip" title="likes"
                                    style={{ fontSize: 20 }}></i> : {this.state.likes} &nbsp;
                                                <i className="fa fa-thumbs-o-down" data-toggle="tooltip" title="dislike"
                                    style={{ fontSize: 20 }}></i> : {this.state.dislike}
                            </strong>
                            </p> :
                                this.state.questionuid === 0 ? <p className="float-right"><strong>
                                    Asked By : {this.state.createdBy} <br />
                                    <p className="float-right"><strong>
                                        <i className="fa fa-thumbs-o-up" data-toggle="tooltip" title="likes"
                                            style={{ fontSize: 20 }}></i> : {this.state.likes} &nbsp;
                                                <i className="fa fa-thumbs-o-down" data-toggle="tooltip" title="dislike"
                                            style={{ fontSize: 20 }}></i> : {this.state.dislike}
                                    </strong>
                                    </p>
                                </strong>
                                </p> :
                                    <p className="float-right">
                                        <strong>
                                            Asked By :<a href={`/profile/${this.state.questionuid}`}>{this.state.createdBy}</a> <br />
                                            <Link className="fa fa-thumbs-o-up" data-toggle="tooltip" title="likes"
                                                style={{ fontSize: 20 }}></Link> : {this.state.likes} &nbsp;
                                                <Link className="fa fa-thumbs-o-down" data-toggle="tooltip" title="dislike"
                                                style={{ fontSize: 20 }}></Link> : {this.state.dislike} </strong>
                                    </p>
                        }
                        <br />
                        <h3>Answers : {this.state.answerList.length}</h3>
                        <hr />
                        {
                            this.state.answerList.length === 0 ? "No Answer posted yet" :
                                this.state.answerList.slice(0, this.state.showMoreAns).map(answers => (
                                    <React.Fragment>
                                        {
                                            Number(sessionStorage.getItem("userid")) === answers.user_id && answers.user_id !== 0 ?
                                                <React.Fragment>
                                                    {
                                                        this.state.answerid === answers.answer_id &&
                                                            this.state.editAnswer === true ?
                                                            <React.Fragment>
                                                                <div className="col-sm-12">
                                                                    <textarea type="text" className="form-control"
                                                                        value={this.state.answerEdit} rows="5"
                                                                        onChange={(e) => this.changeAnswer(e.target.value)} />
                                                                </div>
                                                                <br />
                                                                <div className="col-sm-2 float-right">
                                                                    <button className="btn btn-primary"
                                                                        onClick={() => this.updateAnswer(this.state.answerid)}>Update</button>
                                                                    &nbsp;
                                                                        <button className="btn btn-primary"
                                                                        onClick={() => this.setState({
                                                                            editAnswer: false
                                                                        })}>Cancel</button>
                                                                </div>
                                                                <br />
                                                                <br />
                                                            </React.Fragment>
                                                            :
                                                            <React.Fragment>
                                                                <div key={answers.answer_id} className="container">
                                                                    <div className="card">
                                                                        <div className="card-body">
                                                                            {answers.answer}
                                                                        </div>
                                                                        <div className="card-footer">
                                                                            <button className="btn btn-warning pi pi-pencil" data-toggle="tooltip"
                                                                                data-placement="top"
                                                                                title="Edit"
                                                                                onClick={() => this.getTexBox(answers.answer_id, answers.answer)}>
                                                                            </button>
                                                                            &nbsp;
                                                                                <button className="btn btn-danger pi pi-trash" data-toggle="tooltip" data-placement="top"
                                                                                title="Delete"
                                                                                onClick={() => this.deleteAnswerDialog(answers.answer_id)}>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </React.Fragment>
                                                    }
                                                    {/* Delete Answer Dialog */}
                                                    <Dialog visible={this.state.deleteDialog} header="DELETE ANSWER" style={{ width: '17vw' }}
                                                        className="text-center" onHide={this.onHide}>
                                                        <div>
                                                            <label><h6><b>Confirm</b></h6></label>
                                                        </div>
                                                        <div>
                                                            <Button style={{ width: 100 }} label="Yes"
                                                                onClick={() => this.deleteAnswer(this.state.answerid)} />
                                                            &nbsp;
                                                                    <Button style={{ width: 100 }} label="Cancel"
                                                                onClick={() => this.setState({
                                                                    deleteDialog: false
                                                                })} />
                                                        </div>
                                                    </Dialog>
                                                </React.Fragment>
                                                :
                                                <React.Fragment>
                                                    {
                                                        answers.user_id === this.state.questionuid ?
                                                            <div key={answers.answer_id} className="container">
                                                                <div className="card">
                                                                    <div className="card-body">
                                                                        <p>{answers.answer}</p>
                                                                        <p className="my-1 float-right">Comment By User : {answers.user_id === 0 ? answers.firstName + " " + answers.lastName : <a href={`/profile/${answers.user_id}`}>{answers.firstName + " " + answers.lastName}</a>} </p>
                                                                    </div>
                                                                </div>
                                                            </div> :
                                                            <React.Fragment>
                                                                <div key={answers.answer_id} className="container float-right">
                                                                    <div className="card">
                                                                        <div className="card-body">
                                                                            <p>{answers.answer}</p>
                                                                            <p className="my-1 float-right">Answered By : {answers.user_id === 0 ? answers.firstName + " " + answers.lastName : <a href={`/profile/${answers.user_id}`}>{answers.firstName + " " + answers.lastName}</a>} </p>
                                                                            <div>
                                                                                <Link className="fa fa-caret-up"
                                                                                    style={this.state.upVote === false ? { color: "lightblue", fontSize: 25 } : { fontSize: 25, color: "black" }}>
                                                                                </Link>&nbsp;
                                                                                <span className="badge"
                                                                                    style={{ fontSize: 15 }}>
                                                                                    {this.state.vote}
                                                                                </span>&nbsp;
                                                                                <Link className="fa fa-caret-down"
                                                                                    style={{ fontSize: 25 }}>
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </React.Fragment>
                                                    }
                                                </React.Fragment>
                                        }
                                    </React.Fragment>
                                ))
                        }
                        {
                            this.state.answerList.length < 5 ? "" :
                                this.state.showMore === true ?
                                    <div className="float-left ml-3">
                                        <Link onClick={() => this.setState({
                                            showMoreAns: 10000,
                                            showMore: false
                                        })}>View More >>></Link><br /><br />
                                    </div> : ""
                        }
                        {
                            Number(sessionStorage.getItem("userid")) !== 0 ?
                                <React.Fragment>
                                    <br />
                                    <SubmitAnswer questionId={this.props.match.params.questionId} submitAnswer={this.submitAnswer} />
                                </React.Fragment> :
                                <React.Fragment>
                                    <br />
                                    <GuestAnswer questionId={this.props.match.params.questionId} submitAnswer={this.guestAnswer} />
                                </React.Fragment>
                        }
                        <br />
                        <br />
                        {
                            Number(sessionStorage.getItem("userid")) === this.state.questionuid ?
                                this.state.questionuid === 0 ? "" :
                                    <button className="btn btn-danger float-right" onClick={this.deleteQueDialog}>
                                        <i className="pi pi-trash"></i>Delete Question</button> : ""
                        }
                        {/* Delete Question Dialog */}
                        <Dialog visible={this.state.questionDialog} header="DELETE QUESTION" style={{ width: '17vw' }}
                            className="text-center" onHide={this.onHide}>
                            <div>
                                <label><h6><b>Confirm</b></h6></label>
                            </div>
                            <div>
                                <Button style={{ width: 100 }} label="Yes"
                                    onClick={this.deleteQuestion} />
                                &nbsp;
                                    <Button style={{ width: 100 }} label="Cancel"
                                    onClick={() => this.setState({
                                        questionDialog: false
                                    })} />
                            </div>
                        </Dialog>
                    </div>
                </div>
            </React.Fragment >
        );
    }
}

export default Question;