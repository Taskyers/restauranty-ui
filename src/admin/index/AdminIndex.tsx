import React from "react";
import LoggedHeader from "../../shared/header/LoggedHeader";
import { Button, Row } from "react-bootstrap";

export default class AdminIndex extends React.Component<any, any> {
    render() {
        return (
            <>
                <LoggedHeader text={ "Administrator" } link={ "/admin" }/>
                <Row className="justify-content-center align-self-center text-center">
                    <span>
                        <a href='/admin/reports'>
                            <Button>Reports</Button>
                        </a>
                    </span> &nbsp;
                    <span>
                        <a href='/admin/users'>
                            <Button>Users</Button>
                        </a>
                    </span>
                </Row>
            </>
        )
    }
}
