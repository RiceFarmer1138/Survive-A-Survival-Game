import { start } from "shared/utils/jecs/start";
import receiveReplication from "./systems/receive-replication";
import { Players } from "@rbxts/services";
import paths from "shared/paths";
import gameUI from "./app/gameUI";
import pagePaths from "shared/utils/ui/ui-paths";

if (!game.IsLoaded()) game.Loaded.Wait()
const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui
const shopUI = paths.Assets.UI.GameUI.Clone() as GameUI

shopUI.Parent = playerGui
gameUI(pagePaths(shopUI))

start([
    { system: receiveReplication }
])