import Object from "@rbxts/object-utils";

const InventorySize = 30;

export function getOpenSlot(inventory: Inventory) {
	const inventoryArray = Object.keys(inventory);
	for (let index = 0; index < InventorySize; index++) {
		if (inventoryArray[index] === undefined) {
			// return the open slot
			return index;
		}
	}

	// no more open slot / inventory is full
	return -1;
}
