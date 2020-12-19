import React from "react";
import LoggedHeader from "../../shared/header/LoggedHeader";
import {Button, ButtonGroup, Row} from "react-bootstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";
import ResponseMessage from "../../ResponseMessage";
import {RestaurantReservationDTO} from "../../restaurant/reservation/RestaurantReservationDTO";
import {reservationStatuses} from "../../restaurant/reservation/RestaurantReservation";


export default class ClientReservation extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {reservations: [], success: false, failure: false, message: '', filterToDisplay: ''};
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');

    }

    componentDidMount() {
        axios.get<RestaurantReservationDTO[]>(`/api/client/reservations`).then(result => {
            const pendingReservations = result.data.filter((reservation: RestaurantReservationDTO) => reservation.status === 'PENDING');
            this.setState({reservations: pendingReservations});
        });
        this.setState({filterToDisplay: 'PENDING'});
    }

    cancelReservation(id: number): void {
        this.sendReservationRequest(id, `/api/client/reservations/cancel/${id}`);
    }

    filterReservations(event: { preventDefault: () => void; }, filter: string): void {
        event.preventDefault();
        this.setState({filterToDisplay: filter});

        axios.get<RestaurantReservationDTO[]>(`/api/client/reservations`).then(result => {
            const pendingReservations = result.data.filter((reservation: RestaurantReservationDTO) => reservation.status === filter);
            this.setState({reservations: pendingReservations});
        });
    }

    sendReservationRequest(id: number, url: string): void {
        axios.put<ResponseMessage<string>>(url).then(result => {
            const reservations = this.state.reservations.filter((reservation: RestaurantReservationDTO) => reservation.id !== id);

            this.setState({reservations: reservations, success: true, message: result.data.message});
        }).catch(reason => {
            this.setState({failure: true, message: 'Error has occurred'});
        });
    }

    render() {
        return (
            <>
                <LoggedHeader text={"Client"} link={"/client"}/>
                <div>
                    <Row className="justify-content-center align-self-center text-center">
                        <ButtonGroup>
                            {reservationStatuses.map((type: string) => {
                                return (
                                    <Button key={type} variant="secondary" name="filter"
                                            onClick={e => this.filterReservations(e, type)}>{type}</Button>
                                )
                            })}
                        </ButtonGroup>
                    </Row>
                    <Row className="justify-content-center align-self-center text-center">
                        <span
                            className="filter-text">Currently filtering by: {this.state.filterToDisplay}
                        </span>
                    </Row>

                    <table className="table table-hover restaurantTable text-center">
                        <thead>
                        <tr>
                            <th scope="col">User</th>
                            <th scope="col">Restaurant</th>
                            <th scope="col">Status</th>
                            <th scope="col">Persons count</th>
                            <th scope="col">Reservation date</th>
                            <th scope="col">Reservation time</th>
                            <th scope="col"/>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.reservations.length > 0 ? this.state.reservations.map((reservation: RestaurantReservationDTO) => {
                            return (
                                <tr key={reservation.id}>
                                    <td>
                                        {reservation.clientUsername}
                                    </td>
                                    <td>
                                        {reservation.restaurantName}
                                    </td>
                                    <td>
                                        {reservation.status}
                                    </td>
                                    <td>
                                        {reservation.personsCount}
                                    </td>
                                    <td>
                                        {reservation.reservationDate}
                                    </td>
                                    <td>
                                        {reservation.reservationTime}
                                    </td>

                                    {this.state.filterToDisplay === 'PENDING' &&
                                    <td>
                                        <button className="btn btn-danger"
                                                onClick={() => this.cancelReservation(reservation.id)}>Cancel
                                        </button>
                                    </td>}

                                </tr>
                            )
                        }) : <tr>
                            <td colSpan={7}>There are no reservations</td>
                        </tr>}
                        </tbody>
                    </table>
                </div>

                {this.state.success &&
                <SweetAlert success title="Success" confirmBtnBsStyle={'info'} timeout={2000}
                            onConfirm={() => this.setState({success: false})}>
                    {this.state.message}
                </SweetAlert>}
                {this.state.failure &&
                <SweetAlert error title="Failure" confirmBtnBsStyle={'info'} timeout={2000}
                            onConfirm={() => this.setState({failure: false})}>
                    {this.state.message}
                </SweetAlert>}
            </>
        )
    }
}
