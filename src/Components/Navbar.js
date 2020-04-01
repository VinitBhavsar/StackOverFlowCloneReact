import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Profile from './Profile';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ''
        }
        //Method Binding
        this.logout = this.logout.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.searchQuestion = this.searchQuestion.bind(this);
    }

    handleSearch(value) {
        let searchString = value;
        this.setState({
            search: searchString
        })
    }
    searchQuestion() {
        let search = this.state.search;
        this.setState({
            search: search
        }, window.location.reload())
        sessionStorage.setItem("searchQuestion", search);
        this.props.history.push(`/search/${search}`);
    }
    logout() {
        sessionStorage.clear();
        localStorage.clear();
        this.props.history.push("/");
    }

    render() {
        return (
            <React.Fragment>
                <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "#4056A1" }}>
                    <Link className="navbar-brand text-white" to="/">QnA</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/">Questions <span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/users">Users</Link>
                            </li>
                        </ul>
                        &nbsp;
                        <Link className="nav-item" data-toggle="tooltip" data-placement="top" title="My Profile" to="/my-profile"><i className="pi pi-user" style={{ fontSize: 22, color: "white" }}></i></Link>
                        &nbsp;
                        {
                            sessionStorage.getItem('userid') !== null ?
                                <React.Fragment>
                                    <Link data-toggle="dropdown-toggle" data-placement="top" title="Profile Settings" to="/profile-settings">
                                        <i className="pi pi-cog" style={{ 'fontSize': '28', color: 'white' }}></i></Link>
                                </React.Fragment>
                                : ""
                        }
                        &nbsp;&nbsp;&nbsp;
                        <form className="form-inline my-2 my-lg-0">
                            <input className="form-control mr-sm-2" type="search" placeholder="Search Question"
                                value={this.state.search} onChange={(e) => this.handleSearch(e.target.value)}
                                aria-label="Search" />
                            <button className="btn btn-success my-2 my-sm-0 text-white" type="button"
                                disabled={this.state.search.length === 0 ? true : ""} onClick={this.searchQuestion}
                            >Search</button>
                        </form>
                        &nbsp;
                        &nbsp;
                    {
                            sessionStorage.getItem('userid') !== null ? <React.Fragment>
                                <Profile firstName={sessionStorage.getItem("firstname")} lastName={sessionStorage.getItem("lastname")} />&nbsp;&nbsp;
                                <button className="btn text-white" style={{ backgroundColor: "#FF8C00" }} onClick={() => this.logout()}>Logout</button>
                            </React.Fragment>
                                :
                                <React.Fragment>
                                    <Link className="nav-link text-white" to="/login">Login</Link> <Link className="btn btn-success" to="/signup">Sign Up</Link>
                                </React.Fragment>
                        }
                    </div>
                </nav>
            </React.Fragment>
        );
    }
}

export default withRouter(Navbar);