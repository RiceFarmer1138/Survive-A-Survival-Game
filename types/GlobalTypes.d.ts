type FirstParam<T extends (...args: unknown[]) => unknown> = T extends (first: infer U, ...args: unknown[]) => unknown
	? U
	: never;

//* Gets the value of the type
type ValueOf<T> = T[keyof T];

type AssetId = `rbxassetid://${number}` | `rbxgameasset://${string}`;

type ValueFromReadonly<T> = T extends Readonly<infer U> ? U : never;

type SnowPlowModel = Assets["SnowPlow"]["StarterSnowPlow"]
type SnowPlowName = keyof Omit<Assets["SnowPlow"], keyof Folder | "Parts">;
type Plot = GameMap["Plots"][keyof Omit<GameMap["Plots"], keyof Folder>]

type GameUI = Assets["UI"]["GameUI"]

type TowVehiclePartModel = Assets["SnowPlow"]["Parts"][TowVehiclePartName]
type TowVehicleRarity = "Common" | "Uncommon" | "Rare" | "Mythic" | "Eternal"
type TowVehiclePart = {
	Name: TowVehiclePartName;
	Description: string,
	Image: AssetId,
	Price: number,
	InStock: number
	// ProductId: number // Dev products
	Rarity: TowVehicleRarity;
}
type TowVehicleTool = keyof Omit<Assets["Tools"], keyof Folder>
type TowVehiclePartName = keyof Omit<Assets["SnowPlow"]["Parts"], keyof Folder >;

type Inventory = Array<InventoryItem>
type InventoryItem = { 
	ItemName: TowVehiclePartName;
  IsStackable: boolean;
  Amount: number;
  Slot: number; 
}