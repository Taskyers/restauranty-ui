import React from "react";
import LoggedHeader from "../../shared/header/LoggedHeader";
import axios from "axios";
import Restaurant from "./Restaurant";
import SweetAlert from "react-bootstrap-sweetalert";
import ResponseMessage from "../../ResponseMessage";

export default class AdminRestaurants extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = { restaurants: [], success: false, failure: false, message: '' };
        this.verifyRestaurant = this.verifyRestaurant.bind(this);
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
    }

    componentDidMount() {
        axios.get<Restaurant[]>(`/api/admin/restaurants`).then(result => {
            this.setState({ restaurants: result.data });
        }).catch(reason => {
            this.setState({ failure: true, message: 'Error has occurred' });
        });
    }

    verifyRestaurant(id: number) {
        axios.patch<ResponseMessage<Restaurant>>(`/api/admin/restaurants/verify/${ id }`).then(result => {
            const restaurants = this.state.restaurants.filter((restaurant: Restaurant) => restaurant.id !== id);
            this.setState({ restaurants: restaurants, success: true, message: result.data.message });
        }).catch(reason => {
            this.setState({ failure: true, message: 'Error has occurred' });
        });
    }

    render() {
        return (
            <>
                <LoggedHeader text={ "Administrator" } link={ "/admin" }/>
                <div>
                    <table className="table table-hover restaurantTable text-center">
                        <thead>
                        <tr>
                            <th scope="col">Restaurant</th>
                            <th scope="col"/>
                        </tr>
                        </thead>
                        <tbody>
                        { this.state.restaurants.length > 0 ? this.state.restaurants.map((restaurant: Restaurant) => {
                            return (
                                <tr key={ restaurant.id }>
                                    <td>{ restaurant.name }</td>
                                    <td>
                                        <button onClick={ () => this.verifyRestaurant(restaurant.id) }
                                                className="btn btn-primary">Verify
                                        </button>
                                    </td>
                                </tr>
                            );
                        }) : <tr>
                            <td>There are no restaurants to verify</td>
                        </tr> }
                        </tbody>
                    </table>
                </div>
                { this.state.success &&
                <SweetAlert success title="Success" confirmBtnBsStyle={ 'info' } timeout={ 2000 }
                            onConfirm={ () => this.setState({ success: false }) }>
                    { this.state.message }
                </SweetAlert> }
                { this.state.failure &&
                <SweetAlert error title="Failure" confirmBtnBsStyle={ 'info' } timeout={ 2000 }
                            onConfirm={ () => this.setState({ failure: false }) }>
                    { this.state.message }
                </SweetAlert> }
            </>
        )
    }

}
