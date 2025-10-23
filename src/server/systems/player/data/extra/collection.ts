import { createCollection } from "@rbxts/lapis";
import { RunService } from "@rbxts/services";

import type { PlayerData } from "shared/data/defaultData";
import defaultData, { playerDataValidation as validate } from "shared/data/defaultData";

const DATA_STORE_NAME = RunService.IsStudio() ? "DevelopmentStudio" : "Production";

export const collection = createCollection<PlayerData>(DATA_STORE_NAME, {
	defaultData,
	validate,
});
