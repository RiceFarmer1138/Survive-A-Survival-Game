type FirstParameter<T extends (...args: Array<unknown>) => unknown> = T extends (
	first: infer U,
	...args: Array<unknown>
) => unknown
	? U
	: never;

//* Gets the value of the type
type ValueOf<T> = T[keyof T];

type AssetId = `rbxassetid://${number}` | `rbxgameasset://${string}`;

type ValueFromReadonly<T> = T extends Readonly<infer U> ? U : never;

type GameUI = Assets["UI"]["GameUI"];
type Ore = keyof Omit<Assets["Ores"], keyof Folder>;


type Inventory = Array<InventoryItem>;
interface InventoryItem {
	Amount: number;
	IsStackable: boolean;
	Slot: number;
}

declare enum ToolType {
	Axe = "Axe",
	Hammer = "Hammer",
	Pickaxe = "Pickaxe",
}
