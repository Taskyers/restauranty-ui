import React from "react";

export default class Logout extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout(): void {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/';
    }

    render() {
        return <button className="btn btn-primary" onClick={ this.logout }>Logout</button>
    }
}
