import { Atom, atom } from "@rbxts/charm";

const pageStates = {
    openPage: atom("None") as Atom<"Shop" | "None">,
    inventoryItems: atom(new Array<InventoryItem>()),
    restockedParts: atom(new Array<TowVehiclePart>()),
    restockTime: atom(0),
    hotbarSelected: atom() as Atom<InventoryItem | undefined>,
    buyFocus: atom({ visible: false, selectedPartIndex: -1 }),
}

export default pageStates;