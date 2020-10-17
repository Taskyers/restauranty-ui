import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Index from "./index";

export default class Router extends React.Component<any, any> {
    render() {
        return (
            <BrowserRouter>
                <Route exact path='/' render={ props => <Index { ...props } /> }/>
                <Route exact path='/restaurant'/>
                <Route exact path='/client'/>
            </BrowserRouter>
        );
    }
}
