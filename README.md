Stack Overflow Clone Web Application

Front-End : React
Back-End : Spring Boot

UserList.js And ViewProfile.js Changes : 

    #UserList.js
    <img key={users.user_id} className="img-responsive img-rounded"
     src={users.imageName === null ? "http://placehold.it/256/256" :
     `http://{YourlocalhostAddress}/Images/${users.imageName}`
     }
     alt="profile pic" width="64" height="64" />
    #ViewProfile.js
    <img className="card-img" src={this.state.profileImage !== null ?
     `http://{YourLocalHostAddress}/Images/${this.state.profileImage}` : "/images/hMDvl.jpg"
     } alt="Profile Pic" width="128" height="128"
     style={{ width: 128, marginLeft: 15, marginTop: 13, border: "1px solid dark" }} />