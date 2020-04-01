import React, { Component } from 'react';
import { url } from '../App';

class NewQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titleError: '',
            descriptionError: '',
            questionTitle: '',
            questionDesc: '',
        }
        this.spanStyle = {
            color: 'red'
        }
        this.updateQuestion = this.updateQuestion.bind(this);
        this.updateDescription = this.updateDescription.bind(this);
        this.createQuestion = this.createQuestion.bind(this);
    }

    componentDidMount() {
        document.title = "QnA | Create Question"
        console.log(sessionStorage.getItem("userid"))
        if (sessionStorage.getItem("userid") === null) {
            this.props.history.push("/login");
        }
    }
    updateDescription(value) {
        debugger
        let description = value;
        let valid = false;

        if (description === '') {
            valid = false;
            this.setState({
                descriptionError: 'This field is required'
            })
        }
        else {
            valid = true;
            this.setState({
                descriptionError: '',
            })
        }
        this.setState({
            questionDesc: description
        })
        return valid;
    }

    updateQuestion(value) {
        debugger
        let question = value;
        let valid = false;

        if (question === '') {
            valid = false;
            this.setState({
                titleError: 'This field is required'
            })
        }
        else {
            valid = true;
            this.setState({
                titleError: '',
            })
        }
        this.setState({
            questionTitle: question
        })
        return valid;
    }

    validation = () => {
        debugger
        let valid = false;

        let isQuestionValid = this.updateQuestion(this.state.questionTitle);
        let isDescriptionValid = this.updateDescription(this.state.questionDesc);

        if (!isQuestionValid) {
            valid = false;
        }
        else if (!isDescriptionValid) {
            valid = false;
        }
        else {
            valid = true;
        }
        return valid;
    }

    createQuestion() {
        debugger
        let valid = this.validation();

        let data = {
            "user_id": sessionStorage.getItem("userid"),
            "firstName": sessionStorage.getItem("firstname"),
            "lastName": sessionStorage.getItem("lastname"),
            "question": this.state.questionTitle,
            "description": this.state.questionDesc
        }
        if (valid) {
            fetch(url + "createQuestion", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(response => {
                    console.log(response.status);
                    if (response.status === 200) {
                        this.props.history.push("/my-profile");
                    }
                })
                .catch(err => console.log(err));
        }
    }

    render() {
        return (
            <React.Fragment>
                {/* <div className="container mt-5">
                    <div className="row">
                        <div className="col-12 mt-5">
                            <div className="card border-primary ">
                                <div className="card-header">New Question</div>
                                <div className="card-body text-left">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Question:</label>
                                        <input
                                            type="text"
                                            onChange={(e) => this.updateQuestion(e.target.value)}
                                            className="form-control"
                                            placeholder="Give your question a title."
                                            value={this.state.questionTitle}
                                        />
                                        <span style={this.spanStyle}>{this.state.titleError}</span>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Description:</label>
                                        <input
                                            type="text"
                                            onChange={(e) => this.updateDescription(e.target.value)}
                                            className="form-control"
                                            placeholder="Give more context to your question."
                                            value={this.state.questionDesc}
                                        />
                                        <span style={this.spanStyle}>{this.state.descriptionError}</span>
                                    </div>
                                    <button type="button"
                                        className="btn btn-primary"
                                        onClick={this.createQuestion}>
                                        Submit Question
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
                {/* <div className="container">
                    <div className="card">
                        <div className="card-body">
                            <label>Question</label>
                            <input type="text" className="form-control" />
                            <label htmlFor="exampleInputEmail1">Description:</label>
                            <textarea
                                type="text"
                                onChange={(e) => this.updateDescription(e.target.value)}
                                className="form-control"
                                placeholder="Give more context to your question."
                                value={this.state.questionDesc}
                            />
                            <br />
                            <button type="button"
                                className="btn btn-primary"
                                onClick={this.createQuestion}>
                                Submit Question
                                    </button>
                        </div>
                    </div>
                </div> */}
                <div className="container mt-5" style={{ width: 950 }}>
                    <div className="row">
                        <div className="col">
                            <h4>Ask New Question</h4>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-sm-12">
                            <p style={{ fontSize: 22 }}>Question</p>
                        </div>
                        <div className="col-sm-12">
                            <input type="text" className="form-control" placeholder="Give Your Question A Title"
                                onChange={(e) => this.updateQuestion(e.target.value)}
                                value={this.state.questionTitle} />
                            <br />
                            <span style={this.spanStyle} className="float-right">{this.state.titleError}</span>
                        </div>
                        <div className="col-sm-12">
                            <p style={{ fontSize: 22 }}>Description</p>
                        </div>
                        <div className="col-sm-12">
                            <textarea type="text" className="form-control" value={this.state.questionDesc}
                                onChange={(e) => this.updateDescription(e.target.value)}
                                rows='5' placeholder="Give Little Decription Of Your Question" />
                            <br />
                            <span className="float-right" style={this.spanStyle}>{this.state.descriptionError}</span>
                        </div>
                        <div className="col">
                            <button type="button" style={{ backgroundColor: "#479761" }}
                                className="btn text-white"
                                onClick={this.createQuestion}>
                                Submit Question
                                    </button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default NewQuestion;