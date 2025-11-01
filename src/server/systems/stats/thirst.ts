import type { World } from "@rbxts/jecs";
import Log from "@rbxts/log";

import { routes } from "shared/network";
import { addComponent, getEntity, setEntity } from "shared/utils/functions/jecsHelpFunctions";
import {
	Body,
	Changed,
	Data,
	Player,
	systemQueue,
	TakeFromThirst,
	TargetEntity,
	ThirstBar,
	WalkSpeed,
	world,
} from "shared/utils/jecs/components";
import { useRoute } from "shared/utils/jecs/plugins/hooks/use-route";

const SPRINT_SPEED = 21;

const playersWithoutThirst = world.query(Player).with(Body, Data).without(ThirstBar).cached();
const takeFromThirst = world.query(TakeFromThirst).cached();
const thirstQuery = world.query(ThirstBar).cached();

/** `updateHunger` A system for updating and replenishing players' hunger. */
export default function UpdateThirst(): void {
	const deltaTime = systemQueue.getDeltaTime();

	useRoute("sprint", (isSprinting, player) => {
		const sprintEntity = player && getEntity.fromInstance(player);
		const sprinterData = sprintEntity !== undefined && world.get(sprintEntity, Data);
		const thirst = sprintEntity !== undefined && world.get(sprintEntity, ThirstBar);
		if (sprintEntity && sprinterData && thirst) {
			if (isSprinting) {
				setEntity.takeFromThirstBar(sprintEntity, { percentile: 0.5 / thirst.maxThirst });
				addComponent(sprintEntity, WalkSpeed, { walkSpeed: SPRINT_SPEED });
			} else {
				addComponent(sprintEntity, WalkSpeed, { walkSpeed: 16 });
			}
		}
	});

	for (const [_, thirstEntity, thirstBar] of world.query(TargetEntity, Changed(ThirstBar))) {
		if (!world.contains(thirstEntity)) {
			continue;
		}

		const player = world.get(thirstEntity, Player);
		const { maxThirst, thirst } = thirstBar.new ?? { maxThirst: 100, thirst: 100, thirstRate: 0.6 };
		if (player) {
			routes.updateStats.sendTo({ statAmount: thirst, statMaxAmount: maxThirst, statType: "thirst" }, player);
		}
	}

	// handle thirst depletion
	for (const [thristTakenAwayEntity, takeFromThirstComponent] of takeFromThirst) {
		const { bodyEntity } = takeFromThirstComponent;
		const thirstComponent = world.contains(bodyEntity) && world.get(bodyEntity, ThirstBar);
		if (!thirstComponent) {
			continue;
		}

		const { maxThirst, thirst } = thirstComponent;
		let amountToTake = 0;

		if ("percentile" in takeFromThirstComponent) {
			amountToTake = maxThirst * takeFromThirstComponent.percentile;
		} else if ("amount" in takeFromThirstComponent) {
			amountToTake = takeFromThirstComponent.amount;
		}
		// Log.Debug(`Current Thirst: ${thirst}`);

		world.delete(thristTakenAwayEntity);
		if (thirst >= amountToTake) {
			addComponent(bodyEntity, ThirstBar, {
				...thirstComponent,
				thirst: thirst - amountToTake,
			});
		} else {
			addComponent(bodyEntity, WalkSpeed, { walkSpeed: 16 });
			Log.Info("Player ran out of thirst!");
		}
	}

	// replenishing the hunger by time
	for (const [thirstEntity, thirstBar] of thirstQuery) {
		const { maxThirst, thirst, thirstRate } = thirstBar;
		const currentThirst = math.min(thirst + thirstRate * deltaTime, maxThirst);

		// marks the entity dead once their hunger drops to 0
		if (currentThirst !== thirst) {
			addComponent(thirstEntity, ThirstBar, {
				...thirstBar,
				thirst: currentThirst,
			});
		}
	}

	// adds the hunger bar to players without it
	for (const [bodyEntity] of playersWithoutThirst) {
		addComponent(bodyEntity, ThirstBar, { maxThirst: 100, thirst: 100, thirstRate: 10 });
	}
}
