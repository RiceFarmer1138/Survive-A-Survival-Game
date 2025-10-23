import { Players, Workspace } from "@rbxts/services";

export const { LocalPlayer } = Players;
export const LocalCharacter = LocalPlayer.Character || LocalPlayer.CharacterAdded.Wait()[0];

export const ClientCamera = Workspace.CurrentCamera;
