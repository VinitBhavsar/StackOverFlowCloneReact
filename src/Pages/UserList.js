import React, { Component } from 'react';
import { url } from '../App';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            searchString: '',
            offset: 0,
            perPage: 12,
            selected: null
        }

        //Method Binding
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        document.title = "QnA | Users"
        this.getAllUsers();
    }

    getAllUsers() {
        fetch(url + "getAllUsers/" + this.state.perPage + "/" + this.state.offset)
            .then(res => {
                return res.json();
            })
            .then(result => {
                this.setState({
                    userList: result
                })
            })
    }

    handleChange() {
        this.setState({
            searchString: this.refs.search.value
        });
    }

    handlePage = data => {
        console.log(data);
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);

        this.setState({ offset: offset }, () => {
            this.getAllUsers();
        });
    };

    render() {
        let user = this.state.userList;
        let search = this.state.searchString.trim().toLowerCase();

        if (search.length > 0) {
            user = user.filter(function (users) {
                return (users.firstName + " " + users.lastName).toLowerCase().match(search);
            });
        }

        return (
            <React.Fragment>
                <div className="container m-5 pt-5">
                    <div className="row m-1">
                        <div className="col">
                            <h4>Search users:</h4>
                        </div>
                    </div>
                    <br />
                    <div className="row m-1">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="pi pi-search"></i></span>
                            </div>
                            <input type="text" className="form-control bg-white col-sm-3" placeholder="Search Users"
                                value={this.state.searchString} ref="search" onChange={this.handleChange} /> &nbsp;
                        </div>
                    </div>
                    <br />
                    <br />
                    <div className="row">
                        {
                            this.state.userList.length === 0 ? <div className="col">User List Ended</div>
                                :
                                user.map(users => (
                                    <div className="col-sm-4" key={users.user_id}>
                                        <Link to={`/profile/${users.user_id}`}>
                                            <img key={users.user_id} className="img-responsive img-rounded"
                                                src={users.imageName === null ? "http://placehold.it/256/256" :
                                                    `http://{YourlocalhostAddress}/Images/${users.imageName}`
                                                }
                                                alt="profile pic" width="64" height="64" />
                                        </Link>
                                        <Link to={`/profile/${users.user_id}`}>
                                            <p key={users.user_id} className="list-group-item-heading">
                                                {users.firstName + " " + users.lastName}
                                            </p>
                                        </Link>
                                        <br />
                                    </div>
                                ))
                        }
                    </div>
                    <br />
                    <br />
                    {
                        this.state.userList.length === 0 ? "" :
                            <div className="react-paginate ul li float-right">
                                <ReactPaginate
                                    previousLabel={'previous'}
                                    nextLabel={'next'}
                                    breakLabel={'...'}
                                    breakClassName={'break-me'}
                                    pageCount={this.state.pageCount}
                                    marginPagesDisplayed={1}
                                    pageRangeDisplayed={4}
                                    onPageChange={this.handlePage}
                                    containerClassName={'pagination'}
                                    subContainerClassName={'pages pagination'}
                                    activeClassName={'active'}
                                />
                            </div>
                    }
                </div>
                <div className="container ml-5">
                </div>
            </React.Fragment>
        );
    }
}

export default UserList;