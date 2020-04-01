import React, { Component, Fragment } from 'react';

class SubmitAnswer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answer: '',
            queid: '',
            ansError: ''
        }
        this.spanStyle = {
            color: 'red'
        }
        this.editorChange = this.editorChange.bind(this);
    }
    updateAnswer(value) {
        let ans = value;
        let valid = false;

        if (ans === '') {
            valid = false;
            this.setState({
                ansError: '* Answer can not be null'
            })
        }
        else {
            valid = true;
            this.setState({
                ansError: ''
            })
        }
        this.setState({
            answer: value,
        });
        return valid
    }

    editorChange(e) {
        debugger
        this.setState({
            editorData: e.editor.getData()
        })
    }
    validation = () => {
        let valid = false;

        let isAnswerValid = this.updateAnswer(this.state.answer);

        if (!isAnswerValid) {
            valid = false;
        }
        else {
            valid = true;
        }
        return valid
    }
    submit() {

        let valid = this.validation();

        if (valid) {
            this.props.submitAnswer(this.state.answer, this.props.questionId);

            this.setState({
                answer: '',
            });
        }
    }

    render() {
        return (
            <Fragment>
                <br />
                <div className="form-group">
                    <textarea
                        type="text" rows="7"
                        onChange={(e) => { this.updateAnswer(e.target.value) }}
                        className="form-control"
                        placeholder="Share your answer."
                        value={this.state.answer}
                    />
                    <span style={this.spanStyle}>{this.state.ansError}</span>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => { this.submit() }}>
                    Submit
        </button>
            </Fragment>
        );
    }
}

export default SubmitAnswer;