import { Atom, atom } from "@rbxts/charm";

const pageStates = {
    openPage: atom("None") as Atom<"Shop" | "None">,
    inventoryItems: atom(new Array<InventoryItem>()),
}

export default pageStates;