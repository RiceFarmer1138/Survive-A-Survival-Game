import { Players } from "@rbxts/services";

import paths from "shared/paths";
import { start } from "shared/utils/jecs/start";
import pagePaths from "shared/utils/ui/ui-paths";

import gameUI from "./app/gameUI";
import receiveReplication from "./systems/receive-replication";

if (!game.IsLoaded()) {
	game.Loaded.Wait();
}

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;
const shopUI = paths.Assets.UI.GameUI.Clone();

shopUI.Parent = playerGui;
gameUI(pagePaths(shopUI));

start([{ system: receiveReplication }]);
