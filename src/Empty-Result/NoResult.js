import React from 'react';
import '../CSS/NoResult.css';

const NoResult = () => {
    return (
        <div className="noresults">
            <img className="emptyStore"
                src="https://res.cloudinary.com/sivadass/image/upload/v1494699523/icons/bare-tree.png"
                alt="Empty Tree"
            />
            {/* <h2 className="text-center">Sorry, no products are available at moment</h2> */}
        </div>
    )
}
export default NoResult;