import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Index from "./index";
import SendEmailForm from "./index/recovery/SendEmailForm";
import ChangePasswordForm from "./index/recovery/ChangePasswordForm";
import RestaurantsDashboard from "./restaurant/RestaurantsDashboard";
import RestaurantPhotos from "./restaurant/photos/RestaurantPhotos";
import ClientIndex from "./client/index/ClientIndex";
import ClientReview from "./client/reviews/ClientReview";
import RestaurantReviews from "./restaurant/reviews/RestaurantReviews";
import ReviewReports from "./admin/ReviewReports";
import Chat from "./index/chat/Chat";
import RestaurantMenu from "./restaurant/menu/RestaurantMenu";

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
                <Route exact path='/restaurant/reviews/:restaurantName'
                       render={ ({ match }) => <RestaurantReviews restaurantName={ match.params.restaurantName }/> }/>
                <Route exact path='/restaurant/menu/:restaurantName'
                       render={ ({ match }) => <RestaurantMenu restaurantName={ match.params.restaurantName }/> }/>
                <Route exact path='/client' component={ ClientIndex }/>
                <Route exact path='/client/reviews/:restaurantName'
                       render={ ({ match }) => <ClientReview restaurantName={ match.params.restaurantName }/> }/>
                <Route exact path='/admin' component={ ReviewReports }/>
                <Route exact path='/chat' component={ Chat }/>
            </BrowserRouter>
        );
    }
}
