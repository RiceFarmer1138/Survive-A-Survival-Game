import type { Entity, World } from "@rbxts/jecs";

import { routes } from "shared/network";
import { createEntity, getEntity } from "shared/utils/functions/jecsHelpFunctions";
import { componentsToReplicate } from "shared/utils/jecs/components";
import { useMemo } from "shared/utils/jecs/plugins/hooks/use-memo";
import { useRoute } from "shared/utils/jecs/plugins/hooks/use-route";

export default function ReceiveReplication(world: World) {
	useRoute("deleteReplicatedEntity", (serverEntity: Entity) => {
		const clientEntity = getEntity.replicatedFromServerEntity(serverEntity);

		// if client entity then remove
		if (clientEntity !== undefined) {
			world.delete(clientEntity);
		}
	});

	for (const [componentName, component] of pairs(componentsToReplicate)) {
		useRoute(componentName, ({ data, serverEntity }: { data?: unknown; serverEntity: Entity }) => {
			const clientEntity =
				getEntity.replicatedFromServerEntity(serverEntity) || createEntity.replicated(serverEntity);

			if (!data) {
				world.remove(clientEntity, component);
			} else {
				world.set(clientEntity, component as never, data as never);
			}
		});
	}

	useMemo(() => {
		routes.getReplicatedComponents.send();
	}, []);
}
