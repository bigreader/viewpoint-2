import React from 'react';
import Navbar from './Navbar';

const PageContainer = props => (
  <>
    {props.navbar === false? null : <Navbar />}

    <div className={props.margins === false? "container-fluid" : "container-fluid my-3 my-xl-5 px-xl-5"}>
      <div className="row">
        {props.children}
      </div>
    </div>
  </>
);

export default PageContainer
