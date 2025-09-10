import { ReplicatedStorage, SoundService, Workspace } from "@rbxts/services";

export default {
	Assets: ReplicatedStorage.WaitForChild("Assets") as Assets,
	Map: Workspace.WaitForChild("Map") as GameMap,
	Characters: Workspace.WaitForChild("Characters") as Characters,
};