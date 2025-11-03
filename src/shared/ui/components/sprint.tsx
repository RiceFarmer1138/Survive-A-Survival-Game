import type { Derivable } from "@rbxts/vide";
import Vide, { read, Show, source } from "@rbxts/vide";
import { Container } from "./primitive/container";
import { useCharacter } from "../hooks/use-character";
import { useEventListener, useMotion } from "@rbxts/pretty-vide-utils";
import { routes } from "shared/network";
import { SprintContainer } from "./sprint-container";
import { Players, UserInputService } from "@rbxts/services";
import { springs } from "../constants";

export function Sprint({ progress }: { progress: Derivable<number> }): Vide.Node {
	const thirstSize = () => UDim2.fromScale(1, read(progress))
	const character = useCharacter(Players.LocalPlayer);
	const sprintAttach: () => BasePart = () => read(character).FindFirstChild("HumanoidRootPart") as BasePart;
	const thirstShow = source(false);

	useEventListener(UserInputService.InputBegan, (inputObject, gps) => {
		if (gps) {
			return;
		}

		if (inputObject.KeyCode === Enum.KeyCode.LeftShift) {
			thirstShow(true);
		}
	});

	useEventListener(UserInputService.InputEnded, (inputObject, gps) => {
		if (gps) {
			return;
		}

		if (inputObject.KeyCode === Enum.KeyCode.LeftShift) {
			thirstShow(false);
		}
	});

	return (
		<Show when={thirstShow}>
			{() => {
				return (
					<SprintContainer adornee={() => read(sprintAttach)} >
						<Container
						size={() => UDim2.fromScale(1, 1)}
						transparency={0.45}
						backgroundColor={Color3.fromHex("#696666")}
					>
						<frame
							Name="SprintBar"
							AnchorPoint={() => new Vector2(0, 1)}
							Size={() => thirstSize()}
							Position={() => UDim2.fromScale(0, 1)}
							BackgroundColor3={() => Color3.fromRGB(110, 205, 227)}
						/>
					</Container>
					</SprintContainer>
					
				);
			}}
		</Show>
	);
}
