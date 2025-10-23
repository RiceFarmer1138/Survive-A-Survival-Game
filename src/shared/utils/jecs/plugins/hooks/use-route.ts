import { Janitor } from "@rbxts/janitor";

import { routes } from "shared/network";

import { hotReloader } from "../../components";
import { getInstanceByName } from "../../start";
import { useEffect } from "./use-effect";

const sth: keyof typeof routes = "Body";

type ListenCallback<R extends keyof typeof routes> = Parameters<(typeof routes)[R]["listen"]>[0];

export function useRoute<T extends keyof typeof routes>(route: T, callback: ListenCallback<T>) {
	useEffect(
		() => {
			const trash = new Janitor();
			const systemModule = getInstanceByName(debug.info(callback, "s")[0]) as ModuleScript;

			const callbackCast = callback as unknown as (data: unknown, player?: Player) => void;
			trash.Add(
				(routes[route] as { listen: (callback_: ListenCallback<T>) => unknown }).listen(
					callbackCast,
				) as Callback,
			);

			if (systemModule) {
				trash.Add(
					hotReloader.listen(
						systemModule,
						() => {},
						() => {
							trash?.Destroy?.();
						},
					),
				);
			}

			return () => {
				trash?.Destroy?.();
			};
		},
		[],
		route,
	);
}
