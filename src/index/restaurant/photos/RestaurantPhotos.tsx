import React from "react";
import axios from "axios";
import './RestaurantPhotos.less';
import { RestaurantPhoto } from "./RestaurantPhoto";
import { PhotoProvider, PhotoConsumer } from 'react-photo-view';
import 'react-photo-view/dist/index.css';
import SweetAlert from "react-bootstrap-sweetalert";
import Swal, { SweetAlertOptions } from "sweetalert2";
import ResponseMessage from "../../../ResponseMessage";
import { Button, Col, Form, FormControl, FormGroup, Modal } from "react-bootstrap";

export default class RestaurantPhotos extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            images: [],
            isLoaded: false,
            message: '',
            success: false,
            failure: false,
            showModal: false,
            photo: null
        };
        this.deleteImage = this.deleteImage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.showAddModal = this.showAddModal.bind(this);
        this.hideAddModal = this.hideAddModal.bind(this);
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
    }

    componentDidMount() {
        let promises: any[] = [];
        let encodedImages: RestaurantPhoto[] = [];
        axios.get<any[]>(`/api/restaurant/images/${ this.props.restaurantName }`).then((result: any) => {
            for ( let i = 0; i < result.data.length; i++ ) {
                const image = result.data[i];
                promises.push(axios.get(`/api/restaurant/images/get/${ image.name }`, { responseType: 'arraybuffer' })
                                   .then((result: any) => {
                                       const base64 = btoa(new Uint8Array(result.data).reduce((data, byte) => data + String.fromCharCode(byte), ''),);
                                       encodedImages.push(new RestaurantPhoto(`data:;base64,${ base64 }`, image.name, image.size, image.type));
                                   }));
            }
            Promise.all(promises).then(() => this.setState({ images: encodedImages, isLoaded: true }));
        });
    }

    deleteImage(name: string) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        } as SweetAlertOptions).then((result: any) => {
            if ( result.value ) {
                axios.delete<ResponseMessage<string>>(`/api/restaurant/images/${ name }`)
                     .then(result => {
                         const images = this.state.images.filter((image: RestaurantPhoto) => image.name !== name);
                         this.setState({ message: result.data.message, success: true, images: images });
                     }).catch(reason => {
                    this.setState({ message: 'Error occurred', failure: true });
                });
            }
        })
    }

    handleSubmit(event: { preventDefault: () => void; }): void {
        event.preventDefault();
        const formData = new FormData();
        formData.append('image', this.state.photo);
        axios.post<ResponseMessage<string>>(`/api/restaurant/images/${ this.props.restaurantName }`, formData, { headers: { 'content-type': 'multipart/form-data' } })
             .then(result => {
                 this.setState({ message: result.data.message, success: true });
                 window.location.reload();
             }).catch(reason => {
            this.setState({ message: 'Error occurred', failure: true });
        });
    }

    handleInputChange(event: any): void {
        event.preventDefault();
        this.setState({ photo: event.target.files[0] });
    }

    showAddModal(): void {
        this.setState({ showModal: true });
    }

    hideAddModal(): void {
        this.setState({ showModal: false });
    }

    render() {
        return (
            <>
                <div className="row mb-1">
                    { !this.state.isLoaded &&
                    <SweetAlert showCloseButton={ false } showConfirm={ false } info title="Please wait"
                                timeout={ 2000 }
                                onConfirm={ () => false }>
                        Loading...
                    </SweetAlert> }
                    <table className='table table-hover restaurantTable text-center'>
                        <thead>
                        <tr>
                            <th scope='col'>Name</th>
                            <th scope='col'>Size</th>
                            <th scope='col'>Type</th>
                            <th scope='col'/>
                            <th scope='col'/>
                        </tr>
                        </thead>
                        <tbody>
                        <PhotoProvider>
                            { this.state.images.length > 0 && this.state.images.map((image: RestaurantPhoto) => {
                                return (

                                    <tr key={ image.name }>
                                        <td>{ image.name }</td>
                                        <td>{ image.size }</td>
                                        <td>{ image.type }</td>
                                        <td>
                                            <PhotoConsumer src={ image.content } intro={ image.name }>
                                                <img className='restaurant-image' src={ image.content }
                                                     alt={ image.name }/>
                                            </PhotoConsumer>
                                        </td>
                                        <td>
                                            <button className="btn btn-danger"
                                                    onClick={ () => this.deleteImage(image.name) }>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }) }
                        </PhotoProvider>
                        { this.state.isLoaded && this.state.images.length === 0 &&
                        <tr>
                            <td colSpan={ 5 }>There are no photos</td>
                        </tr> }
                        </tbody>
                    </table>
                </div>
                <div className="row">
                    <div className="col-auto">
                        <button onClick={ this.showAddModal } className="btn btn-secondary float-right">Add photo
                        </button>
                    </div>
                </div>
                <Modal show={ this.state.showModal } onHide={ this.hideAddModal }>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-center">
                            Add photo
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={ this.handleSubmit }>
                            <FormGroup>
                                <Col>
                                    <FormControl required type="file" accept=".png, .jpg, .jpeg" name="photo"
                                                 onChange={ this.handleInputChange }/>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col sm={ 4 }>
                                    <Button type="submit">
                                        Submit
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
