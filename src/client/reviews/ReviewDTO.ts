export class ReviewDTO {
    constructor(readonly id: number, readonly user: string, readonly content: string, readonly rate: number, readonly owner: boolean) {
    }
}
