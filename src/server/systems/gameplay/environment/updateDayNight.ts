import { Lighting } from "@rbxts/services";

import { addComponent } from "shared/utils/functions/jecsHelpFunctions";
import { Day, world } from "shared/utils/jecs/components";

const MAX_CYCLE_DAY = 50;
const CYCLE_DURATION = 6 * 30;
const CYCLE_START = os.clock();
const CYCLE_ENTITY = world.entity();

export default function UpdateDayNight(): void {
	const elapsedTime = os.clock() - CYCLE_START;
	const seconds = elapsedTime % CYCLE_DURATION;
	const minutes = math.floor(seconds % 60);
	const hour = math.floor(seconds / 60);
	const day = math.min(math.floor(elapsedTime / CYCLE_DURATION) + 1, MAX_CYCLE_DAY);

	const indicator = hour >= 12 ? "PM" : "AM";

	Lighting.ClockTime = 12 + hour + minutes / 60;
	addComponent(CYCLE_ENTITY, Day, { day, indicator });
}
