import type { Document } from "@rbxts/lapis";
import { t } from "@rbxts/t";

const defaultData = {
	inventoryData: [] as Inventory,
};

export const playerDataValidation = t.interface({
	inventoryData: t.array(
		t.interface({
			Amount: t.number,
			IsStackable: t.boolean,
			Slot: t.number,
		}),
	),
});

export default defaultData;
export type PlayerData = typeof defaultData;
export type DocumentData = Document<PlayerData>;
