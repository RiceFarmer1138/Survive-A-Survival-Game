import type { Derivable, Node } from "@rbxts/vide";
import Vide, { Show } from "@rbxts/vide";

interface OnlyInPlaceProps {
	readonly children: () => Node | void;
	readonly placeId: Derivable<number>;
}

export function OnlyInPlace({ children, placeId }: OnlyInPlaceProps): Vide.Node {
	return <Show when={() => game.PlaceId === placeId}>{children}</Show>;
}
