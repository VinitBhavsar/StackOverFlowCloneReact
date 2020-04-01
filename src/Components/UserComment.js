import React, { Component } from 'react';

class UserComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: '',

        }
    }
    comment(value) {
        this.setState({
            comment: value,
        });
    }

    submit() {
        this.props.submitComment(this.state.comment, this.props.questionId);

        this.setState({
            comment: '',
        });
    }

    render() {
        return (
            <React.Fragment>
                <br/>
                <label>User Comments</label>
                <div className="form-group text-center">
                    <input
                        type="text"
                        onChange={(e) => { this.comment(e.target.value) }}
                        className="form-control"
                        placeholder="Comment on answer."
                        value={this.state.answer}
                    />
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => { this.submit() }}>
                    Submit
        </button>
                <hr className="my-4" />
            </React.Fragment>
        );
    }
}

export default UserComment;