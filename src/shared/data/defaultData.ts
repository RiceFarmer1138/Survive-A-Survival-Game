import { Document } from "@rbxts/lapis";
import { t } from "@rbxts/t";
import snowPlowDefaultData, { snowPlowValidation } from "./snowPlowData";

const defaultData = {
	Coins: 100000,
	inventoryData: [
		{ ItemName: "WoodenBlock", IsStackable: false, Amount: 100, Slot: 1 },
		{ ItemName: "Steel Block", IsStackable: false, Amount: 100, Slot: 1 },
		{ ItemName: "Seat", IsStackable: false, Amount: 100, Slot: 100 },
		{ ItemName: "Standard Wheel", IsStackable: false, Amount: 100, Slot: 1 },
		{ ItemName: "Fuel Canister", IsStackable: false, Amount: 100, Slot: 1 },
	] as Inventory,
	snowPlow: snowPlowDefaultData
	
};

export const playerDataValidation = t.interface({
	Coins: t.number,
	inventoryData: t.array(
    t.interface({
      ItemName: t.string as t.check<TowVehiclePartName>,
      IsStackable: t.boolean,
      Amount: t.number,
      Slot: t.number,
    }),
  ),
	snowPlow: snowPlowValidation,
});

export default defaultData;
export type PlayerData = typeof defaultData;
export type DocumentData = Document<PlayerData, true>;
