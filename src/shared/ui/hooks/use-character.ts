import { useEventListener } from "@rbxts/pretty-vide-utils";
import type { Source } from "@rbxts/vide";
import { source } from "@rbxts/vide";

export function useCharacter(player: Player): Source<Model> {
	const character = source(player.Character || player.CharacterAdded.Wait()[0]);

	useEventListener(player.CharacterAdded, (char) => character(char));
	useEventListener(player.CharacterRemoving, (char) => character(char));

	return character;
}
