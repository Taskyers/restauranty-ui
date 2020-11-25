import React from "react";
import LoggedHeader from "../../shared/header/LoggedHeader";
import axios from "axios";
import User from "./User";
import SweetAlert from "react-bootstrap-sweetalert";
import ResponseMessage from "../../ResponseMessage";

export default class Users extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = { users: [], success: false, failure: false, message: '' };
        this.banUser = this.banUser.bind(this);
        this.unbanUser = this.unbanUser.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
    }

    componentDidMount() {
        axios.get<User[]>('/api/admin/users').then(result => {
            this.setState({ users: result.data });
        });
    }

    banUser(id: number): void {
        this.sendRequest(id, '/ban');
    }

    unbanUser(id: number): void {
        this.sendRequest(id, '/unban');
    }

    sendRequest(id: number, url: string): void {
        axios.patch<ResponseMessage<string>>(`/api/admin/users/${ url }/${ id }`).then(result => {
            this.setState({ success: true, message: result.data.message });
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
                            <th scope="col">Username</th>
                            <th scope="col">Email</th>
                            <th scope="col">Account type</th>
                            <th scope="col"/>
                        </tr>
                        </thead>
                        <tbody>
                        { this.state.users.length > 0 ? this.state.users.map((user: User) => {
                            return (
                                <tr key={ user.id }>
                                    <td>{ user.username }</td>
                                    <td>{ user.email }</td>
                                    <td>{ user.accountType }</td>
                                    { user.enabled ?
                                        <td>
                                            <button onClick={ () => this.banUser(user.id) }
                                                    className="btn btn-danger">Ban
                                            </button>
                                        </td> :
                                        <td>
                                            <button onClick={ () => this.unbanUser(user.id) }
                                                    className="btn btn-info">Unban
                                            </button>
                                        </td> }
                                </tr>
                            )
                        }) : <tr>
                            <td colSpan={ 3 }>There are no users</td>
                        </tr> }
                        </tbody>
                    </table>
                </div>
                { this.state.success &&
                <SweetAlert success title="Success" confirmBtnBsStyle={ 'info' } timeout={ 2000 }
                            onConfirm={ () => window.location.reload() }>
                    { this.state.message }
                </SweetAlert> }
                { this.state.failure &&
                <SweetAlert error title="Failure" confirmBtnBsStyle={ 'info' } timeout={ 2000 }
                            onConfirm={ () => window.location.reload() }>
                    { this.state.message }
                </SweetAlert> }
            </>
        )
    }
}
