import { World } from "@rbxts/jecs";
import paths from "shared/paths";
import { createEntity } from "shared/utils/functions/jecsHelpFunctions";
import { useMemo } from "shared/utils/jecs/plugins/hooks/use-memo";

const plotCollection = paths.Map.Plots

function addPlot(plotModel: Instance) {
   if (!plotModel.GetAttribute("ServerId")) createEntity.createPlot(plotModel as Plot)
}

/**
 * `loadData`
 * A system for creating plot's spawners
 */
export default (world: World) => {
    useMemo(() => {
        plotCollection.GetChildren().forEach((plot) => addPlot(plot))
        plotCollection.ChildAdded.Connect((plot) => addPlot(plot))
    }, [])
}