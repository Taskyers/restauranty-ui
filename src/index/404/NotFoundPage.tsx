import React from 'react';
import './NotFoundPage.less';
import Header from "../header/Header";

export default () =>
    <>
        <Header/>
        <div className="not-found-page">
            <h1>Resource has not been found</h1>
            <a href="/">
                <button className="btn btn-primary">Back to main page</button>
            </a>
        </div>
    </>
