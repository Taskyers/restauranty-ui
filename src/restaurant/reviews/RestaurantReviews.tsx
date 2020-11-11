import React from "react";
import axios from "axios";
import { ReviewDTO } from "./ReviewDTO";
import { Modal } from "react-bootstrap";
import DangerAlert from "../../utils/swal/DangerAlert";
import ResponseMessage from "../../ResponseMessage";
import SweetAlert from "react-bootstrap-sweetalert";

export default class RestaurantReviews extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = { showContentModal: false, content: '', reviews: [], success: false, failure: false, message: '' };
        this.showContent = this.showContent.bind(this);
        this.hideContent = this.hideContent.bind(this);
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
    }

    componentDidMount() {
        axios.get<ReviewDTO[]>(`/api/restaurant/reviews/${ this.props.restaurantName }`).then(result => {
            this.setState({ reviews: result.data });
        });
    }

    reportReview(id: number): void {
        const alert = DangerAlert.getReportAlert();
        alert.then(result => {
            if ( result.value ) {
                axios.post<ResponseMessage<string>>(`/api/restaurant/reviews/report`, {
                    'reviewId': id,
                    'restaurant': this.props.restaurantName
                }).then(result => {
                    const reviews = this.state.reviews.map((review: ReviewDTO) => {
                        return review.id === id ? new ReviewDTO(review.id, review.user, review.content, review.rate, true) : review;
                    });
                    this.setState({ reviews: reviews, success: true, message: result.data.message });
                }).catch(reason => {
                    this.setState({ failure: true, message: 'Error has occurred' });
                });
            }
        });
    }

    showContent(content: string): void {
        this.setState({ showContentModal: true, content: content });
    }

    hideContent(): void {
        this.setState({ showContentModal: false });
    }

    render() {
        return (
            <>
                <div>
                    <table className="table table-hover restaurantTable text-center">
                        <thead>
                        <tr>
                            <th scope="col">User</th>
                            <th scope="col">Content</th>
                            <th scope="col">Rate</th>
                            <th scope="col"/>
                        </tr>
                        </thead>
                        <tbody>
                        { this.state.reviews.length > 0 ? this.state.reviews.map((review: ReviewDTO) => {
                            return (
                                <tr key={ review.id }>
                                    <td>{ review.user }</td>
                                    <td>
                                        <button className="btn btn-primary"
                                                onClick={ () => this.showContent(review.content) }>Show
                                        </button>
                                    </td>
                                    <td>{ review.rate }/5</td>
                                    <td> { !review.reported &&
                                    <button className="btn btn-danger"
                                            onClick={ () => this.reportReview(review.id) }>Report review
                                    </button> }
                                    </td>
                                </tr>
                            )
                        }) : <tr>
                            <td colSpan={ 4 }>There are no reviews</td>
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
        );
    }

}
