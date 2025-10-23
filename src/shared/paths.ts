import { ReplicatedStorage, Workspace } from "@rbxts/services";

export default {
	Assets: ReplicatedStorage.WaitForChild("Assets") as Assets,
	Characters: Workspace.WaitForChild("Characters") as Characters,
	Map: Workspace.WaitForChild("Map") as GameMap,
};
