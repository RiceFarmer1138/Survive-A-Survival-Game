import { cframe } from "@rbxts/bytenet";
import { World } from "@rbxts/jecs";
import Object, { deepCopy } from "@rbxts/object-utils";
import { MarketplaceService, Players, Workspace } from "@rbxts/services";
import partsData from "shared/data/plowPartsData";
import { routes } from "shared/network";
import paths from "shared/paths";
import { getOpenSlot } from "shared/utils/functions/inventoryFunctions";
import { createEntity, getEntity } from "shared/utils/functions/jecsHelpFunctions";
import { Added, Data, Player, Plot, Removed } from "shared/utils/jecs/components";
import { useEvent } from "shared/utils/jecs/plugins/hooks/use-event";
import { useRoute } from "shared/utils/jecs/plugins/hooks/use-route";

const playersStock = new Map<Player, typeof partsData.partsCollection>();

function getPartsToRestock(): Array<TowVehiclePartName> {
	const partsToAdd = new Array<TowVehiclePartName>();
	const allParts = partsData.partsCollection;

	allParts.forEach((part) => {
		const rarity = part.Rarity;
		const appearChance = partsData.partsChances[rarity];

		if (math.random(1, appearChance) === 1) partsToAdd.push(part.Name);
	});

	return partsToAdd;
}

function takeVehiclePartFromShop(vehiclePart: TowVehiclePart, player: Player) {
	const playerPartStocks = getPlayersStock(player);
	const playerPartIndex = playerPartStocks.findIndex((part) => part.Name === vehiclePart.Name);

	if (vehiclePart.InStock > 0) {
		updatePlayersStock((oldStock) => {
			oldStock[playerPartIndex] = {
				...oldStock[playerPartIndex],
				InStock: oldStock[playerPartIndex].InStock - 1,
			};

			return oldStock;
		}, player);
		return true;
	}

	return false;
}

function getRandomStockFromRarity({ Rarity }: TowVehiclePart) {
	const [min, max] = partsData.partRarityStocks[Rarity];
	return math.random(min, max);
}

function updatePlayersStock(
	updateFunc: (oldStock: Array<TowVehiclePart>) => Array<TowVehiclePart>,
	player: Player,
): void {
	const newStock = updateFunc(getPlayersStock(player));
	playersStock.set(player, newStock);
	routes.updatePartsShop.sendTo(newStock, player);
}

function getPlayersStock(player: Player): Array<TowVehiclePart> {
	if (!playersStock.has(player)) {
		const partsToRestock = getPartsToRestock();
		playersStock.set(player, deepCopy(partsData.partsCollection));
		updatePlayersStock((stock) => {
			stock.forEach((part) => {
				part.InStock =
					partsToRestock.findIndex((v) => v === part.Name) !== -1 ? getRandomStockFromRarity(part) : 0;
			});
			return stock;
		}, player);
	}

	return playersStock.get(player)!;
}

let timeTillRestock = os.time() + 5 * 60;

/**
 * `snowPartsShop`
 * A system for stock loading and restocking
 */
export default (world: World) => {
	for (const [_userId, productId, wasPurchased] of useEvent(MarketplaceService.PromptProductPurchaseFinished)) {
		const player = Players.GetPlayerByUserId(_userId);
		const playerEntity = player && getEntity.fromInstance(player);

		if (player && playerEntity && productId === 3392251104 && wasPurchased) {
			const partsToRestock = getPartsToRestock();

			updatePlayersStock((stock) => {
				stock.forEach((part) => {
					const partExists = partsToRestock.some((partToCheck) => partToCheck === part.Name);
					const stocksToAdd = getRandomStockFromRarity(part);
					if (partExists)
						if (part.InStock > 0) part.InStock += stocksToAdd;
						else if (part.InStock === 0) part.InStock = stocksToAdd;
						else if (!partExists && part.InStock === 0) part.InStock = 0;
				});
				return stock;
			}, player);
		}
	}

	useRoute("placePart", ({ vehiclePart, vehicleLocation }, player) => {
		const entity = player && getEntity.fromInstance(player);
		const data = entity && world.get(entity, Data);
		const plot = data && world.get(entity, Plot);
		if (entity && world.contains(entity) && data && plot) {
			const { ItemName } = vehiclePart;

			createEntity.updateInventory((inventory) => {
				const alreadyExistItem = inventory.find((item) => item.ItemName === ItemName);

				// if item exists in the invetory, we can subtract from the count
				if (alreadyExistItem) {
					alreadyExistItem.Amount--;
					const partModel = paths.Assets.SnowPlow.Parts[ItemName].Clone();
					partModel.PivotTo(
						new CFrame(vehicleLocation.position).mul(
							CFrame.Angles(
								vehicleLocation.orientation[0],
								vehicleLocation.orientation[1],
								vehicleLocation.orientation[2],
							),
						),
					); // world cframe
					partModel.Parent = paths.Map.Placement;
					partModel.GetDescendants().forEach((descendant) => {
						if (descendant.IsA("BasePart")) descendant.CanCollide = true;
					});
					if (alreadyExistItem.Amount <= 0) {
						// if the item has 0 counts after deducting, we just remove the item completely
						const indexToRemove = inventory.findIndex((item) => item.ItemName === ItemName);
						inventory.remove(indexToRemove);
						return inventory;
					}
				}
				return inventory;
			}, entity);
		}
	});

	// request to buy snow vehicle parts
	useRoute("buyPart", (vehiclePart, player) => {
		const { Name, Price, InStock } = vehiclePart;
		const entity = player && getEntity.fromInstance(player);

		if (entity && InStock > 0) {
			createEntity.updateData((oldData) => {
				print(oldData);
				if (oldData.Coins >= Price) {
					takeVehiclePartFromShop(vehiclePart, player);
					// deducts cash
					oldData.Coins -= Price;
					// insert item to inventory
					createEntity.updateInventory((inventory) => {
						const openSlot = getOpenSlot(inventory);
						const alreadyExistItem = inventory.find((item) => item.ItemName === Name);

						print(openSlot);
						// no open slot exists
						if (openSlot === -1) return inventory;

						// adds the item if theres an open slot
						if (alreadyExistItem) {
							alreadyExistItem.Amount += 1;
						} else {
							inventory.push({ ItemName: Name, Amount: 1, Slot: openSlot, IsStackable: true });
						}
						print(inventory);

						return inventory;
					}, entity);

					// play some sound once player successfully purchased the vehicle part
				} else {
					// purchase failed...
				}
				return oldData;
			}, entity);
		}
	});

	// when its time to restock
	if (timeTillRestock - os.time() <= 0) {
		const partsToRestock = getPartsToRestock();

		// updates the current restock time
		timeTillRestock = os.time() + 5 * 60;

		Players.GetPlayers().forEach((player) => {
			updatePlayersStock((stock) => {
				stock.forEach((part) => {
					part.InStock =
						partsToRestock.findIndex((v) => v === part.Name) !== -1 ? getRandomStockFromRarity(part) : 0;
				});
				return stock;
			}, player);
			routes.updateRestockTime.sendTo(timeTillRestock, player);
		});
	}

	for (const [_, player] of world.query(Added(Player))) {
		print(timeTillRestock);
		getPlayersStock(player);
		routes.updateRestockTime.sendTo(timeTillRestock, player);
	}

	for (const [_, player] of world.query(Removed(Player))) {
		playersStock.delete(player);
	}
};
