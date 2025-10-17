import { World } from "@rbxts/jecs";
import { Players, Workspace } from "@rbxts/services";
import { Tracer } from "@rbxts/tracer";
import paths from "shared/paths";
import { RayParams } from "shared/utils/functions/rayFunctions";
import { worldBuilder } from "shared/utils/jecs/components";
import { useMemo } from "shared/utils/jecs/plugins/hooks/use-memo";
import { useThrottle } from "shared/utils/jecs/plugins/hooks/use-throttle";

const oreCollection = paths.Map.Ores
const mapBox = paths.Map.Box
const ORE_SPAWN_INTERVAL = 25

const RNG = new Random()
function updateOres() {
    if (oreCollection.GetChildren().size() >= worldBuilder.GetMaxOres()) {
        return
    } else {
        // raycasts to find a position to spawn ore
        const [boxPosition, boxSize] = [mapBox.Position, mapBox.Size]
        const randX = RNG.NextNumber(boxPosition.X - boxSize.X / 2, boxPosition.X + boxSize.X / 2)
        const randZ = RNG.NextNumber(boxPosition.Z - boxSize.Z / 2, boxPosition.Z + boxSize.Z / 2)
        const result = Tracer.ray(new Vector3(randX, boxPosition.Y, randZ), Vector3.yAxis.mul(-100)).useRaycastParams(RayParams.Include.Map).run()

        if (result && result.hit) {
            worldBuilder.NewOre().name("GoldOre").position(result.position)
            .build()
        }
    }
}

export default function spawnOre(world: World) {
    useMemo(() => task.defer(updateOres), [useThrottle(ORE_SPAWN_INTERVAL)])
}
