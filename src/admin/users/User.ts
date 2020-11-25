export default class User {
    constructor(readonly id: number, readonly username: string, readonly email: string, readonly accountType: string, readonly enabled: boolean) {
    }
}
