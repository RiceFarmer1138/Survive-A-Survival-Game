import { useEventListener, useMotion } from "@rbxts/pretty-vide-utils";
import { Players, UserInputService } from "@rbxts/services";
import Vide, { read, source } from "@rbxts/vide";

import { routes } from "shared/network";

import { Sprint } from "../components/sprint";
import { SprintContainer } from "../components/sprint-container";
import { positions, springs, worldContext } from "../constants";
import { useCharacter } from "../hooks/use-character";
import { Hunger } from "../components/hunger";
import jecs_vide, { useEntityGet, useQuery, useQueryFirst } from "@rbxts/jecs-vide";
import { Container } from "../components/primitive/container";
import { DayText } from "../components/day-text";
import { Day } from "shared/utils/jecs/components";
import { Id, Query } from "@rbxts/jecs";
import { usePx } from "../hooks/use-px";

export default function Hud(): Vide.Node {
	const px = usePx()
	const [thirstProgress, setThirstProgress] = useMotion(1)
	const [hungerProgress, setHungerProgress] = useMotion(1)

	routes.updateStats.listen(({ statAmount, statMaxAmount, statType }) => {
			if (statType === "thirst") {
				setThirstProgress.spring(statAmount / statMaxAmount, springs.gentle);
			} else if (statType === "hunger") {
				setHungerProgress.spring(statAmount/  statMaxAmount, springs.responsive)
			}
		});


	return (
		<>
			<Sprint progress={thirstProgress}/>
			<Hunger progress={hungerProgress} />

			<Container
				size={UDim2.fromScale(1, 1)}
			>
				<DayText text={() => `Day 1`} position={() => positions.topCenter.add(UDim2.fromOffset(0, px(50)))} textSize={() => px(45)} />
			</Container>
		</>
	);
}
