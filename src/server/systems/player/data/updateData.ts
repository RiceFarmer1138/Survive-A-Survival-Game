import type { World } from "@rbxts/jecs";
import { deepCopy } from "@rbxts/object-utils";
import { Players } from "@rbxts/services";
import Sift from "@rbxts/sift";

import type { PlayerData } from "shared/data/defaultData";
import { createEntity } from "shared/utils/functions/jecsHelpFunctions";
import { Body, Data, debugEnabled, Player, UpdateData, UpdateInventory, world } from "shared/utils/jecs/components";

import { getPlayerData, setPlayerData } from "./extra/playerData";

const playersWithoutData = world.query(Body).with(Player).without(Data).cached();

/** `updateData` A system for updating data-related structures. */
export default function UpdatePlayerData(world: World) {
	for (const [updateEntity, update] of world.query(UpdateData)) {
		const { bodyEntity } = update;
		const hasEntity = world.contains(bodyEntity);
		const [body, oldData] = hasEntity ? world.get(bodyEntity, Body, Data) : [];

		world.delete(updateEntity);
		if (body && oldData) {
			const { model } = body;
			const player = Players.GetPlayerFromCharacter(model);
			const updatedData = update.updateFunction(deepCopy(oldData));

			const mergedData = Sift.Dictionary.mergeDeep(oldData, updatedData);
			world.set(bodyEntity, Data, mergedData);
			if (player) {
				const playerDocument = getPlayerData(player);
				if (playerDocument) {
					setPlayerData(player, playerDocument);
					playerDocument.write(mergedData as unknown as PlayerData);
				}
			}
		}
	}

	for (const [updateEntity, { bodyEntity, updateFunction }] of world.query(UpdateInventory)) {
		const hasEntity = world.contains(bodyEntity);
		const [body, oldData] = hasEntity ? world.get(bodyEntity, Body, Data) : [];

		world.delete(updateEntity);
		if (body && oldData) {
			const { model } = body;
			const player = Players.GetPlayerFromCharacter(model);
			const oldInventory = oldData.inventoryData;
			const updatedInventory = updateFunction(deepCopy(oldInventory));

			const mergedInventory =
				updatedInventory.size() < oldInventory.size()
					? updatedInventory
					: Sift.Dictionary.mergeDeep(oldInventory, updatedInventory);
			const finalData = { ...oldData, inventoryData: mergedInventory };

			// if the new data is different from old, we will update with the
			// latest updated data
			if (!Sift.Dictionary.equalsDeep(oldData, finalData)) {
				createEntity.updateData(() => finalData, bodyEntity);
			}
		}
	}

	for (const [bodyEntity, { model }] of playersWithoutData) {
		const player = Players.GetPlayerFromCharacter(model);
		if (player) {
			const playerData = getPlayerData(player);
			if (playerData) {
				const read = playerData.read();
				world.set(bodyEntity, Data, read);
				world.set(world.entity(), UpdateData, { bodyEntity, updateAll: true, updateFunction: () => read });
				world.set(world.entity(), UpdateInventory, { bodyEntity, updateFunction: () => read.inventoryData });
			} else if (debugEnabled) {
				warn(`No player data found for ${player.Name}`);
			}
		}
	}
}
