import { useEventListener, useMotion } from "@rbxts/pretty-vide-utils";
import { Players, UserInputService } from "@rbxts/services";
import Vide, { read, source } from "@rbxts/vide";

import { routes } from "shared/network";

import { Bar } from "../components/bar";
import { BarContainer } from "../components/bar-container";
import { springs } from "../constants";
import { useCharacter } from "../hooks/use-character";

export default function Hud(): Vide.Node {
	const character = useCharacter(Players.LocalPlayer);
	const sprintAttach: () => BasePart = () => read(character).FindFirstChild("HumanoidRootPart") as BasePart;
	const thirstShow = source(false);
	const [thirstBarSize, setThirstBarSize] = useMotion(1);

	routes.updateStats.listen(({ statAmount, statMaxAmount, statType }) => {
		if (statType === "thirst") {
			setThirstBarSize.spring(statAmount / statMaxAmount, springs.gentle);
		}
	});

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
		<>
			<BarContainer adornee={sprintAttach}>
				<Bar shown={thirstShow} adornee={sprintAttach} size={() => UDim2.fromScale(1, read(thirstBarSize))} />
			</BarContainer>
		</>
	);
}
