export class RestaurantReservationDTO {
    constructor(readonly id: number, readonly reservationDate: string, readonly reservationTime: string, readonly personsCount: number,
                readonly restaurantName: string, readonly status: string, readonly clientUsername: number) {
    }
}
