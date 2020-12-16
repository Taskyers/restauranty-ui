import React from "react";
import LoggedHeader from "../../shared/header/LoggedHeader";
import { Button, ButtonGroup, Row } from "react-bootstrap";
import axios from "axios";
import { MenuGroup } from "../../restaurant/menu/MenuGroup";
import { MenuDish } from "../../restaurant/menu/MenuDish";

export default class ClientMenu extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = { menu: [], filterToDisplay: 'ALL' };
        this.filterDishes = this.filterDishes.bind(this);
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
    }

    filterDishes(event: { preventDefault: () => void; }, filter: string): void {
        event.preventDefault();
        this.setState({ filterToDisplay: filter });
        if ( filter === 'ALL' ) {
            return this.componentDidMount();
        }
        axios.get<MenuGroup[]>(`/api/client/menu/${ this.props.restaurantName }/${ filter }`)
             .then(result => {
                 this.setState({ menu: result.data });
             });
    }

    componentDidMount(): void {
        axios.get<MenuGroup[]>(`/api/client/menu/${ this.props.restaurantName }`).then(result => {
            this.setState({ menu: result.data });
        });
    }

    render() {
        return (
            <>
                <LoggedHeader text={ "Client" } link={ "/client" }/>
                <div>
                    <Row className="justify-content-center align-self-center text-center">
                        <ButtonGroup>
                            { this.state.menu.map(({ type }: { type: string }) => {
                                return (
                                    <Button key={ type } variant="secondary" name="filter"
                                            onClick={ e => this.filterDishes(e, type) }>{ type }</Button>
                                )
                            }) }
                            <Button variant="secondary" name="filter"
                                    onClick={ e => this.filterDishes(e, 'ALL') }>{ 'ALL' }</Button>
                        </ButtonGroup>
                    </Row>
                    <Row className="justify-content-center align-self-center text-center">
                        <span
                            className="filter-text">Currently filtering by: { this.state.filterToDisplay }
                        </span>
                    </Row>
                </div>
                { this.state.menu.length > 0 ? this.state.menu.map(({ type, dishes }: { type: string, dishes: MenuDish[] }) => {
                    return (
                        <Row key={ type } className="justify-content-center align-self-center">
                            <div className="restaurant-search-result text-center">
                                <div className="dish-type">
                                    { type }
                                </div>
                                { dishes.map((dish: MenuDish) => {
                                    return (
                                        <div key={ dish.id } className="single-dish">
                                            <div>{ dish.name + ' (' + dish.price + ')' }</div>
                                            <div>{ dish.description }</div>
                                        </div>
                                    )
                                }) }
                            </div>
                        </Row>
                    )
                }) : <span>Menu is not available</span> }
            </>
        )
    }
}
