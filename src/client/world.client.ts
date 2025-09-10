import { start } from "shared/utils/jecs/start";
import receiveReplication from "./systems/receive-replication";
import { Players } from "@rbxts/services";
import paths from "shared/paths";
import gameUI from "./app/gameUI";
import pagePaths from "shared/utils/ui/ui-paths";
import shopUpdate from "./systems/ui/shopUpdate";
import inventoryUpdate from "./systems/ui/inventoryUpdate";

if (!game.IsLoaded()) game.Loaded.Wait()
const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui
const shopUI = paths.Assets.UI.GameUI.Clone() as GameUI

shopUI.Parent = playerGui
gameUI(pagePaths(shopUI))

start([
    { system: shopUpdate },
    { system: inventoryUpdate },
    { system: receiveReplication }
])