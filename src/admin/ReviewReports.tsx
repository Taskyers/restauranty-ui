import React from "react";
import axios from "axios";
import { ReviewReportDTO } from "./ReviewReportDTO";
import { Modal } from "react-bootstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import ResponseMessage from "../ResponseMessage";
import LoggedHeader from "../shared/header/LoggedHeader";

export default class ReviewReports extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = { reports: [], success: false, failure: false, message: '' };
        this.showContent = this.showContent.bind(this);
        this.hideContent = this.hideContent.bind(this);
        this.acceptReport = this.acceptReport.bind(this);
        this.rejectReport = this.rejectReport.bind(this);
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
    }

    componentDidMount() {
        axios.get<ReviewReportDTO[]>(`/api/admin/reviews`).then(result => {
            this.setState({ reports: result.data });
        });
    }

    showContent(content: string): void {
        this.setState({ showContentModal: true, content: content });
    }

    hideContent(): void {
        this.setState({ showContentModal: false });
    }

    acceptReport(id: number): void {
        this.sendReportRequest(id, `/api/admin/reviews/accept/${ id }`);
    }

    rejectReport(id: number): void {
        this.sendReportRequest(id, `/api/admin/reviews/reject/${ id }`);
    }

    sendReportRequest(id: number, url: string): void {
        axios.put<ResponseMessage<string>>(url).then(result => {
            const reports = this.state.reports.filter((report: ReviewReportDTO) => report.id !== id);
            this.setState({ reports: reports, success: true, message: result.data.message });
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
                            <th scope="col">User</th>
                            <th scope="col">Restaurant</th>
                            <th scope="col">Content</th>
                            <th scope="col"/>
                            <th scope="col"/>
                        </tr>
                        </thead>
                        <tbody>
                        { this.state.reports.length > 0 ? this.state.reports.map((report: ReviewReportDTO) => {
                            return (
                                <tr key={ report.id }>
                                    <td>
                                        { report.user }
                                    </td>
                                    <td>
                                        { report.restaurant }
                                    </td>
                                    <td>
                                        <button className="btn btn-primary"
                                                onClick={ () => this.showContent(report.content) }>Show
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-info"
                                                onClick={ () => this.acceptReport(report.id) }>Accept
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger"
                                                onClick={ () => this.rejectReport(report.id) }>Reject
                                        </button>
                                    </td>
                                </tr>
                            )
                        }) : <tr>
                            <td colSpan={ 5 }>There are no reports</td>
                        </tr> }
                        </tbody>
                    </table>
                </div>
                <Modal show={ this.state.showContentModal } onHide={ this.hideContent }>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-center">
                            Review's content
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        { this.state.content }
                    </Modal.Body>
                </Modal>
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
