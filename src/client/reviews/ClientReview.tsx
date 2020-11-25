import React from "react";
import axios from "axios";
import { ReviewDTO } from "./ReviewDTO";
import './ClientReview.less';
import { Button, Col, Form, FormControl, FormGroup, Modal, Row } from "react-bootstrap";
import DangerAlert from "../../utils/swal/DangerAlert";
import ResponseMessage from "../../ResponseMessage";
import SweetAlert from "react-bootstrap-sweetalert";
import LoggedHeader from "../../shared/header/LoggedHeader";

export default class ClientReview extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            averageRate: 0,
            reviews: [],
            showContentModal: false,
            showAddModal: false,
            showEditModal: false,
            content: '',
            success: false,
            failure: false,
            message: '',
            reviewId: 0,
            reviewContent: '',
            reviewRate: ''
        };
        this.showContent = this.showContent.bind(this);
        this.hideContent = this.hideContent.bind(this);
        this.showAddModal = this.showAddModal.bind(this);
        this.hideAddModal = this.hideAddModal.bind(this);
        this.showEditModal = this.showEditModal.bind(this);
        this.hideEditModal = this.hideEditModal.bind(this);
        this.deleteReview = this.deleteReview.bind(this);
        this.editReview = this.editReview.bind(this);
        this.addReview = this.addReview.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleRateChange = this.handleRateChange.bind(this);
        this.calculateRate = this.calculateRate.bind(this);
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
    }

    componentDidMount() {
        axios.get<ReviewDTO[]>(`/api/client/reviews/${ this.props.restaurantName }`).then(result => {
            const reviews: ReviewDTO[] = result.data;
            this.setState({ averageRate: this.calculateRate(reviews), reviews: reviews });
        });
    }

    calculateRate(reviews: ReviewDTO[]): string {
        let rate: number = 0;
        for ( let i = 0; i < reviews.length; i++ ) {
            rate += reviews[i].rate;
        }
        return (rate / reviews.length).toFixed(2);
    }

    showContent(content: string): void {
        this.setState({ showContentModal: true, content: content });
    }

    hideContent(): void {
        this.setState({ showContentModal: false });
    }

    showAddModal(): void {
        this.setState({ showAddModal: true });
    }

    hideAddModal(): void {
        this.setState({ showAddModal: false });
    }

    showEditModal(review: ReviewDTO): void {
        this.setState({
            showEditModal: true,
            reviewId: review.id,
            reviewContent: review.content,
            reviewRate: review.rate
        });
    }

    hideEditModal(): void {
        this.setState({ showEditModal: false, reviewId: 0 });
    }

    handleContentChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        event.preventDefault();
        this.setState({ reviewContent: event.target.value });
    }

    handleRateChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        event.preventDefault();
        this.setState({ reviewRate: event.target.value });
    }

    editReview(event: any): void {
        event.preventDefault();
        axios.put<ResponseMessage<ReviewDTO>>(`/api/client/reviews/${ this.state.reviewId }`, {
            'content': this.state.reviewContent,
            'rate': this.state.reviewRate
        }).then(result => {
            const reviews = this.state.reviews.map((review: ReviewDTO) => {
                return review.id === this.state.reviewId ? result.data.object : review;
            });
            this.setState({
                success: true,
                message: result.data.message,
                reviews: reviews,
                averageRate: this.calculateRate(reviews)
            });
        }).catch(reason => {
            this.setState({ failure: true, message: 'Error has occurred' });
        });
    }

    deleteReview(id: number): void {
        const alert = DangerAlert.getDeleteAlert();
        alert.then(result => {
            if ( result.value ) {
                axios.delete<ResponseMessage<string>>(`/api/client/reviews/${ id }`).then(result => {
                    const reviews = this.state.reviews.filter((review: ReviewDTO) => review.id !== id);
                    this.setState({
                        reviews: reviews,
                        averageRate: this.calculateRate(reviews),
                        success: true,
                        message: result.data.message
                    });
                }).catch(reason => {
                    this.setState({ failure: true, message: 'Error has occurred' });
                });
            }
        });
    }

    addReview(event: any): void {
        event.preventDefault();
        axios.post<ResponseMessage<ReviewDTO>>(`/api/client/reviews`, {
            'restaurant': this.props.restaurantName,
            'content': this.state.reviewContent,
            'rate': this.state.reviewRate
        }).then(result => {
            const reviews = this.state.reviews.concat(result.data.object);
            this.setState({
                success: true,
                averageRate: this.calculateRate(reviews),
                message: result.data.message,
                reviews: reviews
            });
        }).catch(reason => {
            this.setState({ failure: true, message: 'Error occurred' });
        });
    }

    render() {
        return (
            <>
                <LoggedHeader text={ "Client" } link={ "/client" }/>
                <div>
                    { this.state.reviews.length > 0 &&
                    <Row className="justify-content-center align-self-center text-center">
                        <span
                            className="average-rate">Average rate for { this.props.restaurantName } : { this.state.averageRate }/5</span>
                    </Row>
                    }
                    <table className="table table-hover restaurantTable text-center">
                        <thead>
                        <tr>
                            <th scope="col">User</th>
                            <th scope="col">Content</th>
                            <th scope="col">Rate</th>
                            <th scope="col"/>
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
                                    { review.owner ? <td className="action-button">
                                        <button className="btn btn-primary"
                                                onClick={ () => this.showEditModal(review) }>Edit
                                        </button>
                                    </td> : <td/> }
                                    { review.owner ? <td className="action-button">
                                        <button className="btn btn-danger"
                                                onClick={ () => this.deleteReview(review.id) }>Delete
                                        </button>
                                    </td> : <td/> }
                                </tr>
                            )
                        }) : <tr>
                            <td colSpan={ 5 }>There are no reviews</td>
                        </tr> }
                        </tbody>
                    </table>
                </div>
                <Row>
                    <div className="col-auto">
                        <button className="btn btn-secondary float-right" onClick={ this.showAddModal }>Add Review
                        </button>
                    </div>
                </Row>
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
                <Modal show={ this.state.showEditModal } onHide={ this.hideEditModal }>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-center">
                            Edit review
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={ this.editReview }>
                            <FormGroup>
                                <Col>
                                    <FormControl required as="textarea" placeholder="Content" name="content" rows={ 5 }
                                                 cols={ 5 } value={ this.state.reviewContent }
                                                 onChange={ this.handleContentChange }/>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col>
                                    <FormControl required as="select" custom value={ this.state.reviewRate }
                                                 onChange={ this.handleRateChange }>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </FormControl>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col sm={ 4 }>
                                    <Button type="submit">
                                        Edit
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal show={ this.state.showAddModal } onHide={ this.hideAddModal }>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-center">
                            Add review
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={ this.addReview }>
                            <FormGroup>
                                <Col>
                                    <FormControl required as="textarea" placeholder="Content" name="content" rows={ 5 }
                                                 cols={ 5 } onChange={ this.handleContentChange }/>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col>
                                    <FormControl required as="select" defaultValue={ "" } custom
                                                 onChange={ this.handleRateChange }>
                                        <option value="" disabled hidden>Choose rate</option>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </FormControl>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col sm={ 4 }>
                                    <Button type="submit">
                                        Add
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Form>
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
