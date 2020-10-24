import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Index from "./index";
import SendEmailForm from "./index/recovery/SendEmailForm";
import ChangePasswordForm from "./index/recovery/ChangePasswordForm";

export default class Router extends React.Component<any, any> {
    render() {
        return (
            <BrowserRouter>
                <Route exact path='/' render={ props => <Index { ...props } /> }/>
                <Route exact path='/recovery' render={ props => <SendEmailForm { ...props } /> }/>
                <Route exact path='/recovery/:token'
                       render={ ({ match }) => <ChangePasswordForm token={ match.params.token }/> }/>
                <Route exact path='/restaurant'/>
                <Route exact path='/client'/>
            </BrowserRouter>
        );
    }
}
