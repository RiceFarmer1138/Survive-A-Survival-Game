import { Tracer } from "@rbxts/tracer";

import paths from "shared/paths";
import { addComponent } from "shared/utils/functions/jecsHelpFunctions";
import { RayParams } from "shared/utils/functions/rayFunctions";
import { ModelDebugger, Ore, worldBuilder } from "shared/utils/jecs/components";
import { useMemo } from "shared/utils/jecs/plugins/hooks/use-memo";
import { useThrottle } from "shared/utils/jecs/plugins/hooks/use-throttle";

const oreCollection = paths.Map.Ores;
const mapBox = paths.Map.Box;
const RNG = new Random();
function UpdateOres(): void {
	if (oreCollection.GetChildren().size() >= worldBuilder.GetMaxOres()) {
		return;
	}

	// raycasts to find a position to spawn ore
	const [boxPosition, boxSize] = [mapBox.Position, mapBox.Size];
	const rand_x = RNG.NextNumber(boxPosition.X - boxSize.X / 2, boxPosition.X + boxSize.X / 2);
	const rand_z = RNG.NextNumber(boxPosition.Z - boxSize.Z / 2, boxPosition.Z + boxSize.Z / 2);
	const result = Tracer.ray(new Vector3(rand_x, boxPosition.Y, rand_z), Vector3.yAxis.mul(-100))
		.useRaycastParams(RayParams.Include.Map)
		.run();

	if (result.hit) {
		const ore = worldBuilder.Ore().Class("GoldOre").Position(result.position).Build();
		addComponent(ore.GetEntity(), ModelDebugger, ore.GetModel());
		addComponent(ore.GetEntity(), Ore, {
			ore: "GoldOre",
		});
	}
}

export default function SpawnOre(): void {
	useMemo(() => task.defer(UpdateOres), [useThrottle(25)]);
}
