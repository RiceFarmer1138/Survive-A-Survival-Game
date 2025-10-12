import { createCollection, Document } from "@rbxts/lapis";
import Object from "@rbxts/object-utils";
import { Players, RunService } from "@rbxts/services";
import defaultData, { DocumentData, PlayerData, playerDataValidation as validate } from "shared/data/defaultData";

const DATA_STORE_NAME = RunService.IsStudio() ? "DevelopmentV52" : "Production";

const collection = createCollection<PlayerData>(DATA_STORE_NAME, {
	defaultData,
	validate,
});
const playerData = new Map<Player, DocumentData>();

export function setPlayerData(player: Player, data: DocumentData) {
	playerData.set(player, data);
}

export function getPlayerData(player: Player) {
	return playerData.get(player);
}

export async function loadPlayerData(player: Player) {
	try {
		const document = await collection.load(`${player.UserId}`);

		if (!player.IsDescendantOf(Players)) {
			return document.close();
		}

		setPlayerData(player, document);

		Promise.fromEvent(Players.PlayerRemoving, (left) => left === player).then(() => document.close());
		return document;
	} catch (err) {
		warn(`Failed to load player's document: ${player.Name} \n ${err}`);
	}
}

