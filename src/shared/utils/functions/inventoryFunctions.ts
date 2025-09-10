import { ObjectUtil } from "@rbxts/centurion/out/shared/util/data";
import Object from "@rbxts/object-utils";

const InventorySize = 30

export function getOpenSlot(inventory: Inventory) {
    const inventoryArr = Object.keys(inventory)
    for (let i = 0; i < InventorySize; i++) {
        if (inventoryArr[i] === undefined) {
            // return the open slot
            return  i
        }
    }
    // no more open slot / inventory is full
    return -1
}