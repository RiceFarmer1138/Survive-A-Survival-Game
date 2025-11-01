import type { World } from "@rbxts/jecs";

import { actions } from "shared/data/keybinds";
import { routes } from "shared/network";
import { State } from "shared/ui/state";
import { useRoute } from "shared/utils/jecs/plugins/hooks/use-route";

export default function Sprint(world: World): void {
	const isShifting = actions.pressed("sprint");
	if (isShifting) {
		routes.sprint.send(true);
	} else {
		routes.sprint.send(false);
	}
}
