import { World } from "@rbxts/jecs";
import { createCollection, Document } from "@rbxts/lapis";
import { Players } from "@rbxts/services";
import defaultData, { DocumentData, PlayerData, playerDataValidation } from "shared/data/defaultData";
import { Body, Data, debugEnabled, Player, UpdateData, UpdateInventory, world } from "shared/utils/jecs/components";
import { useEffect } from "shared/utils/jecs/plugins/hooks/use-effect";
import { getPlayerData, setPlayerData } from "./extra/playerData";
import { deepCopy, deepEquals } from "@rbxts/object-utils";
import { addComponent, createEntity } from "shared/utils/functions/jecsHelpFunctions";
import Sift from "@rbxts/sift";
import { useThrottle } from "shared/utils/jecs/plugins/hooks/use-throttle";
import { routes } from "shared/network";
import { deepCompareArray } from "@rbxts/phantom/src/Array";

const playersWithoutData = world.query(Body).with(Player).without(Data).cached();

/**
 * `updateData`
 * A system for updating data-related structures
 */
export default function updatePlayerData(world: World) {
	for (const [updateEntity, update] of world.query(UpdateData)) {
		const bodyEntity = update.bodyEntity;
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
			const oldInventory = oldData.inventoryData
			const updatedInventory = updateFunction(deepCopy(oldInventory))

			const mergedInventory = updatedInventory.size() < oldInventory.size() ? updatedInventory :  Sift.Dictionary.mergeDeep(oldInventory, updatedInventory);
			const finalData = { ...oldData, inventoryData: mergedInventory }
			world.set(bodyEntity, Data, finalData);
			if (player) {
				const playerDocument = getPlayerData(player);
				if (playerDocument) {
					routes.updateInventory.sendTo(mergedInventory, player)
					setPlayerData(player, playerDocument);
					playerDocument.write(finalData as unknown as PlayerData);
				}
			}
		}
	}

	for (const [bodyEntity, { model }] of playersWithoutData) {
		const player = Players.GetPlayerFromCharacter(model);
		if (player) {
			const playerData = getPlayerData(player);
			if (playerData) {
				const read = playerData.read() ;
				world.set(bodyEntity, Data, read);
				world.set(world.entity(), UpdateData, { updateFunction: () => read, bodyEntity, updateAll: true });
				world.set(world.entity(), UpdateInventory, { updateFunction: () => read.inventoryData, bodyEntity });
			} else {
				if (debugEnabled) warn(`No player data found for ${player.Name}`);
			}
		}   
	}
};