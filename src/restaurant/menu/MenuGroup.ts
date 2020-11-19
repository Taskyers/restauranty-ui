import { MenuDish } from "./MenuDish";

export class MenuGroup {
    constructor(readonly type: string, readonly dishes: MenuDish[]) {
    }
}
