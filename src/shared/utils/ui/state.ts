import type { Atom } from "@rbxts/charm";
import { atom } from "@rbxts/charm";

const pageStates = {
	inventoryItems: atom(new Array<InventoryItem>()),
	openPage: atom("None") as Atom<"None" | "Shop">,
};

export default pageStates;
