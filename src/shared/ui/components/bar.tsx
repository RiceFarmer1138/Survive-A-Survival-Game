import type { Derivable } from "@rbxts/vide";
import Vide, { read, Show } from "@rbxts/vide";
import { Container } from "./primitive/container";

interface BarProps {
	readonly adornee: Derivable<BasePart>;
	readonly shown?: Derivable<boolean>;
	readonly size?: () => Derivable<UDim2>;
}

export function Bar({ adornee, shown = true, size = () => UDim2.fromScale(1, 1) }: BarProps): Vide.Node {
	const adorneeB = () => read(adornee);
	const barShown = () => read(shown);
	const barSize = () => read(size());

	return (
		<Show when={() => barShown()}>
			{() => {
				return (
					<Container
						size={() => UDim2.fromScale(1, 1)}
						transparency={0.45}
						backgroundColor={Color3.fromHex("#696666")}
					>
						<frame
							Name="SprintBar"
							AnchorPoint={() => new Vector2(0, 1)}
							Size={() => barSize()}
							Position={() => UDim2.fromScale(0, 1)}
							BackgroundColor3={() => Color3.fromRGB(110, 205, 227)}
						/>
					</Container>
				);
			}}
		</Show>
	);
}
