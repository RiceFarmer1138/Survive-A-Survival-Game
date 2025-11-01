import type { World } from "@rbxts/jecs";

import { routes } from "shared/network";
import { addComponent } from "shared/utils/functions/jecsHelpFunctions";
import {
	Body,
	Changed,
	Data,
	HungerBar,
	Player,
	Starved,
	systemQueue,
	TargetEntity,
	world,
} from "shared/utils/jecs/components";

// querying over players that don't have a hunger bar after their character and
// data have loaded
const playersWithoutHunger = world.query(Player).with(Body, Data).without(HungerBar).cached();
const hungerBarChanged = world.query(TargetEntity, Changed(HungerBar)).cached();
const hungerQuery = world.query(HungerBar).cached();

/** `updateHunger` A system for updating and replenishing players' hunger. */
export default function UpdateHunger(world: World): void {
	const deltaTime = systemQueue.getDeltaTime();

	for (const [_, hungerEntity, hungerBar] of hungerBarChanged) {
		if (!world.contains(hungerEntity)) {
			continue;
		}

		const player = world.get(hungerEntity, Player);
		const { hunger, maxHunger } = hungerBar.new ?? { hunger: 175, hungerRate: 0.6, maxHunger: 175 };
		if (player) {
			routes.updateStats.sendTo({ statAmount: hunger, statMaxAmount: maxHunger, statType: "hunger" }, player);
		}
	}

	// replenishing the hunger by time
	for (const [hungerEntity, hungerBar] of hungerQuery) {
		const { hunger, hungerRate, maxHunger } = hungerBar;
		let currentHunger = math.max(hunger - hungerRate * deltaTime, 0);
		currentHunger = math.clamp(currentHunger, 0, maxHunger);

		// marks the entity dead once their hunger drops to 0
		if (currentHunger === 0) {
			addComponent(hungerEntity, Starved);
		}

		addComponent(hungerEntity, HungerBar, {
			...hungerBar,
			hunger: currentHunger,
		});
	}

	// adds the hunger bar to players without it
	for (const [bodyEntity] of playersWithoutHunger) {
		addComponent(bodyEntity, HungerBar, { hunger: 175, hungerRate: 0.6, maxHunger: 175 });
	}
}
