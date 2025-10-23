import { Players } from "@rbxts/services";

import type { DocumentData } from "shared/data/defaultData";

import { collection } from "./collection";

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

		Promise.fromEvent(Players.PlayerRemoving, (left) => left === player).then(async () => document.close());
		return document;
	} catch (err) {
		warn(`Failed to load player's document: ${player.Name} \n ${err}`);
	}
}
