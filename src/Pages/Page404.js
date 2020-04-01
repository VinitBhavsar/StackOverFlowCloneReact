import React from 'react';

class Page404 extends React.Component {
    state = {}
    render() {
        return (
            <React.Fragment>
                <div className="pt-5">
                    <div className="c pt-5">
                        <div className="_404">404</div>
                        <div className="_1">THE PAGE</div>
                        <div className="_2">WAS NOT FOUND</div>
                        <a className="mybtn" href="/">BACK TO HOME</a>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

export default Page404;