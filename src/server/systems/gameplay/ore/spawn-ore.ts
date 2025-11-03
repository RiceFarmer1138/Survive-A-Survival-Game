import Log from "@rbxts/log";
import { Workspace } from "@rbxts/services";
import { Tracer } from "@rbxts/tracer";

import paths from "shared/paths";
import { addComponent } from "shared/utils/functions/jecsHelpFunctions";
import { RayParams, rayParamsFilter } from "shared/utils/functions/rayFunctions";
import { ModelDebugger, Ore, worldBuilder } from "shared/utils/jecs/components";
import { useMemo } from "shared/utils/jecs/plugins/hooks/use-memo";
import { useThrottle } from "shared/utils/jecs/plugins/hooks/use-throttle";

const RNG = new Random();
function UpdateOres(oreFolder: Folder): void {
	if (oreFolder.GetChildren().size() >= worldBuilder.GetMaxOres()) {
		return;
	}

	// raycasts to find a position to spawn ore
	const oreBox = oreFolder.FindFirstChild("OreBox") as BasePart;
	const [boxPosition, boxSize] = [oreBox.Position, oreBox.Size];
	const rand_x = RNG.NextNumber(boxPosition.X - boxSize.X / 2, boxPosition.X + boxSize.X / 2);
	const rand_z = RNG.NextNumber(boxPosition.Z - boxSize.Z / 2, boxPosition.Z + boxSize.Z / 2);
	const result = Tracer.ray(new Vector3(rand_x, boxPosition.Y, rand_z), Vector3.yAxis.mul(-1), 100)
		.useRaycastParams(rayParamsFilter([paths.Map], Enum.RaycastFilterType.Exclude))
		.run();

	const ore = worldBuilder.Ore().Class("GoldOre").Position(result.position).Parent(oreFolder).Build();
	addComponent(ore.GetEntity(), ModelDebugger, ore.GetModel());
	addComponent(ore.GetEntity(), Ore, {
		ore: "GoldOre",
	});
	Log.Debug(`Ore spawned: ${ore.GetModel()}`);
}

export default function SpawnOre(): void {
	useMemo(() => {
		for (const oreContainer of paths.Map.Ore.GetChildren()) {
			task.defer(() => {
				UpdateOres(oreContainer as Folder);
			});
		}
	}, [useThrottle(25)]);
}
