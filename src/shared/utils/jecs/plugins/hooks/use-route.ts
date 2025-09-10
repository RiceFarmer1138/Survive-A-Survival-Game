import { useHookState } from "../topo";
import { defineCleanupCallback } from "@rbxts/hot-reloader";
import { Janitor } from "@rbxts/janitor";
import { hotReloader } from "../../components";
import { ByteNetType, packet, routes } from "shared/network";
import { getInstanceByName } from "../../start";
import { useChange } from "./use-change";
import { useEffect } from "./use-effect";

const sth: keyof typeof routes = "Body";

type ListenCallback<R extends keyof typeof routes> = Parameters<(typeof routes)[R]["listen"]>[0];

export function useRoute<T extends keyof typeof routes>(route: T, callback: ListenCallback<T>) {
	useEffect(
		() => {
			const trash = new Janitor();
			const systemMod = getInstanceByName(debug.info(callback, "s")[0]) as ModuleScript;

			const callbackCast = callback as unknown as (data: unknown, player?: Player) => void;
			trash.Add(
				(routes[route] as { listen: (cb: ListenCallback<T>) => unknown }).listen(
					callbackCast,
				) as unknown as Callback,
			);

			if (systemMod)
				trash.Add(
					hotReloader.listen(
						systemMod,
						() => {},
						() => trash?.Destroy?.(),
					),
				);

			return () => trash?.Destroy?.();
		},
		[],
		route,
	);
}