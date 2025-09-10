import { World } from "@rbxts/jecs";
import { addComponent } from "shared/utils/functions/jecsHelpFunctions";
import { Body, Fuel, FuelRanOut, SnowPlow, systemQueue, world } from "shared/utils/jecs/components";

const fuelToUpdate = world.query(Fuel).with(SnowPlow).without(FuelRanOut).cached();

/**
 * `updateFuel`
 * A system that manages fuel for snowplow vehicles
 */
export default (world: World) => {
	const deltaTime = systemQueue.getDeltaTime();

	// Updating fuel over time
	for (const [fuelEntity, fuelComp] of fuelToUpdate) {
		const { current, max, regenerationRate } = fuelComp;
		const remainingFuel = math.max(current - regenerationRate * deltaTime, 0);
		if (remainingFuel > 0) addComponent(fuelEntity, Fuel, { ...fuelComp, current: remainingFuel });
		else addComponent(fuelEntity, FuelRanOut);
	}
};
