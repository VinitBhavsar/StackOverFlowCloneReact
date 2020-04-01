import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Spinner from 'react-spinner-material';

export const url = "http://localhost:8080/";

const renderLoader = () => <React.Fragment>
  <div className="loader" style={{ textAlign: "center" }}>
    <Spinner size={100} spinnerColor={"#333"} spinnerWidth={2} visible={true} />
  </div>
</React.Fragment>;

const Navbar = lazy(() => import('./Components/Navbar'));
const Home = lazy(() => import('./Pages/Home'));
const Login = lazy(() => import('./Pages/Login'));
const NewQuestion = lazy(() => import('./Pages/NewQuestion'));
const Question = lazy(() => import('./Pages/Question'));
const UserProfile = lazy(() => import('./Pages/UserProfile'));
const MostAnswered = lazy(() => import('./Pages/MostAnswered'));
const UnAnswered = lazy(() => import('./Pages/UnAnswered'));
const MostLiked = lazy(() => import('./Pages/MostLiked'));
const SignUp = lazy(() => import('./Pages/SignUp'));
const SearchResult = lazy(() => import('./Pages/SearchResult'));
const ViewProfile = lazy(() => import('./Pages/ViewProfile'));
const ProfileActivity = lazy(() => import('./Pages/ProfileActivity'));
const UserList = lazy(() => import('./Pages/UserList'));
const ProfileAnswers = lazy(() => import('./Pages/ProfileAnswers'));
const ProfileQuestions = lazy(() => import('./Pages/ProfileQuestions'));
const PasswordForget = lazy(() => import('./Pages/PasswordForget'));
const ResetPass = lazy(() => import('./Pages/ResetPass'));
const UserProfileSettings = lazy(() => import('./Pages/UserProfileSettings'));

function App() {
  return (
    <div className="App">
      <Suspense fallback={renderLoader()}>
        <Router>
          <Switch>
            <div>
              <Navbar />
              {/* Common Routes */}
              <Route exact path="/" component={Home} />
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/forget-password" component={PasswordForget} />
              <Route exact path="/mostAnswered" component={MostAnswered} />
              <Route exact path="/unAnswered" component={UnAnswered} />
              <Route exact path="/mostLiked" component={MostLiked} />
              <Route exact path="/search/:question" component={SearchResult} />
              {/* User Routes */}
              <Route exact path="/users" component={UserList} />
              <Route exact path="/create-question" component={NewQuestion} />
              <Route exact path="/question/:questionId" component={Question} />
              <Route exact path="/my-profile" component={UserProfile} />
              <Route exact path="/profile-settings" component={UserProfileSettings} />
              <Route exact path="/reset-pass" component={ResetPass} />
              {/* Profile-View Routes */}
              <Route exact path="/profile/:profileId" component={ViewProfile} />
              <Route exact path="/:profileId/activity" component={ProfileActivity} />
              <Route exact path="/:profileId/questions" component={ProfileQuestions} />
              <Route exact path="/:profileId/answers" component={ProfileAnswers} />
            </div>
          </Switch>
        </Router>
      </Suspense>

    </div>
  );
}

export default App;
