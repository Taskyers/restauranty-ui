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
import ReviewReports from "./admin/reviews/ReviewReports";
import Chat from "./shared/chat/Chat";
import RestaurantMenu from "./restaurant/menu/RestaurantMenu";
import Users from "./admin/users/Users";
import AdminIndex from "./admin/index/AdminIndex";
import NotFoundPage from "./index/404/NotFoundPage";

export default class Router extends React.Component<any, any> {

    private static readonly ROLE_CLIENT: string = 'client';

    private static readonly ROLE_RESTAURANT: string = 'restaurant';

    private static readonly ROLE_ADMIN: string = 'admin';

    haveProperRole(expected: string): boolean {
        console.log(expected);
        const role = localStorage.getItem('role');
        console.log(role);
        return role !== null && role === expected;
    }

    render() {
        return (
            <BrowserRouter>
                {/* Index */ }
                <Route exact path='/' render={ props => <Index { ...props } /> }/>
                <Route exact path='/recovery' render={ props => <SendEmailForm { ...props } /> }/>
                <Route exact path='/recovery/:token'
                       render={ ({ match }) => <ChangePasswordForm token={ match.params.token }/> }/>
                {/* Restaurant */ }
                <Route exact path='/restaurant'
                       render={ () => this.haveProperRole(Router.ROLE_RESTAURANT) ? <RestaurantsDashboard/> :
                           <NotFoundPage/> }/>
                <Route exact path='/restaurant/images/:restaurantName'
                       render={ ({ match }) => this.haveProperRole(Router.ROLE_RESTAURANT) ?
                           <RestaurantPhotos restaurantName={ match.params.restaurantName }/> : <NotFoundPage/> }/>
                <Route exact path='/restaurant/reviews/:restaurantName'
                       render={ ({ match }) => this.haveProperRole(Router.ROLE_RESTAURANT) ?
                           <RestaurantReviews restaurantName={ match.params.restaurantName }/> : <NotFoundPage/> }/>
                <Route exact path='/restaurant/menu/:restaurantName'
                       render={ ({ match }) => this.haveProperRole(Router.ROLE_RESTAURANT) ?
                           <RestaurantMenu restaurantName={ match.params.restaurantName }/> : <NotFoundPage/> }/>
                {/* Client */ }
                <Route exact path='/client'
                       render={ () => this.haveProperRole(Router.ROLE_CLIENT) ? <ClientIndex/> : <NotFoundPage/> }/>
                <Route exact path='/client/reviews/:restaurantName'
                       render={ ({ match }) => this.haveProperRole(Router.ROLE_CLIENT) ?
                           <ClientReview restaurantName={ match.params.restaurantName }/> : <NotFoundPage/> }/>
                {/* Admin */ }
                <Route exact path='/admin'
                       render={ () => this.haveProperRole(Router.ROLE_ADMIN) ? <AdminIndex/> : <NotFoundPage/> }/>
                <Route exact path='/admin/reports'
                       render={ () => this.haveProperRole(Router.ROLE_ADMIN) ? <ReviewReports/> : <NotFoundPage/> }/>
                <Route exact path='/admin/users'
                       render={ () => this.haveProperRole(Router.ROLE_ADMIN) ? <Users/> : <NotFoundPage/> }/>
                {/* Shared */ }
                <Route exact path='/chat'
                       render={ () => this.haveProperRole(Router.ROLE_CLIENT) || this.haveProperRole(Router.ROLE_RESTAURANT) ?
                           <Chat/> : <NotFoundPage/> }/>
            </BrowserRouter>
        );
    }
}
