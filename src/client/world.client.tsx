import jecs_vide, { useQuery } from "@rbxts/jecs-vide";
import { Players } from "@rbxts/services";
import Vide from "@rbxts/vide";

import paths from "shared/paths";
import Hud from "shared/ui/pages/hud";
import { MainMenu } from "shared/ui/pages/main-menu";
import { OnlyInPlace } from "shared/ui/utils/only-in-place";
import { start } from "shared/utils/jecs/start";
import change from "shared/utils/jecs/systems/change";

import { LocalUI } from "./constants";
import Sprint from "./systems/movement/sprint";
import receiveReplication from "./systems/receive-replication";
import { world } from "shared/utils/jecs/components";
import { worldContext } from "shared/ui/constants";

if (!game.IsLoaded()) {
	game.Loaded.Wait();
}

Vide.mount(() => {
	return (
		<>
			<screengui
				Name="GameUI"
				IgnoreGuiInset={true}
				ZIndexBehavior="Sibling"
				ResetOnSpawn={false}
				ScreenInsets={Enum.ScreenInsets.DeviceSafeInsets}
			>
				<OnlyInPlace placeId={0x00a2d4c8}>
					{() => {
						return <MainMenu />;
					}}
				</OnlyInPlace>
				<Hud/>
			</screengui>
		</>
	);
}, LocalUI);

start([{ system: Sprint }, { system: receiveReplication }, change]);
