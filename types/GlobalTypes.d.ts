type FirstParam<T extends (...args: unknown[]) => unknown> = T extends (first: infer U, ...args: unknown[]) => unknown
	? U
	: never;

//* Gets the value of the type
type ValueOf<T> = T[keyof T];

type AssetId = `rbxassetid://${number}` | `rbxgameasset://${string}`;

type ValueFromReadonly<T> = T extends Readonly<infer U> ? U : never

type GameUI = Assets["UI"]["GameUI"]
type Ore = keyof Omit<Assets["Ores"], keyof Folder>

type Inventory = Array<InventoryItem>
type InventoryItem = { 
  IsStackable: boolean;
  Amount: number;
  Slot: number; 
}

declare enum ToolType {
  Hammer = "Hammer",
  Axe = "Axe",
  Pickaxe = "Pickaxe",
}