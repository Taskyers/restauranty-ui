import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Index from "./index";
import SendEmailForm from "./index/recovery/SendEmailForm";
import ChangePasswordForm from "./index/recovery/ChangePasswordForm";
import RestaurantsDashboard from "./index/restaurant/RestaurantsDashboard";
import RestaurantPhotos from "./index/restaurant/photos/RestaurantPhotos";

export default class Router extends React.Component<any, any> {
    render() {
        return (
            <BrowserRouter>
                <Route exact path='/' render={ props => <Index { ...props } /> }/>
                <Route exact path='/recovery' render={ props => <SendEmailForm { ...props } /> }/>
                <Route exact path='/recovery/:token'
                       render={ ({ match }) => <ChangePasswordForm token={ match.params.token }/> }/>
                <Route exact path='/restaurant' component={ RestaurantsDashboard }/>
                <Route exact path='/restaurant/images/:restaurantName'
                       render={ ({ match }) => <RestaurantPhotos restaurantName={ match.params.restaurantName }/> }/>
                <Route exact path='/client'/>
            </BrowserRouter>
        );
    }
}
