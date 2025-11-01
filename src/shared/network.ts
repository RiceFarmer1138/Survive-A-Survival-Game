import ByteNet, { defineNamespace, definePacket, optional, struct } from "@rbxts/bytenet";
import type { Entity } from "@rbxts/jecs";

import type { ComponentDataFromEntity, MappedComponents } from "./utils/functions/jecsHelpFunctions";
import type { componentsToReplicate } from "./utils/jecs/components";

export type packet<T extends ByteNetType<unknown>> = ReturnType<typeof ByteNet.definePacket<T>>;
export type optional<T extends ByteNetType<unknown>> = ReturnType<typeof ByteNet.optional<T>>;
export type struct<T extends Record<string, ByteNetType<unknown>>> = ReturnType<typeof ByteNet.struct<T>>;
export interface ByteNetType<T> {
	value: T;
}

type Vector3Net = ByteNetType<Vector3> & ReturnType<typeof ByteNet.vec3>;

type MapTableToByteNet<T> = T extends Instance
	? ByteNetType<Instance | T>
	: T extends Array<infer U>
		? ByteNetType<Array<MapTableToByteNet<U>["value"]>>
		: T extends object
			? struct<{ [newKey in keyof T]: MapTableToByteNet<T[newKey]> }>
			: ByteNetType<T>;

export const packets = defineNamespace("Packets", () => {
	return {
		sprint: definePacket({
			reliabilityType: "reliable",
			value: ByteNet.bool
		}),

		updateInventory: definePacket({
			reliabilityType: "reliable",
			value: ByteNet.unknown as ByteNetType<Inventory>,
		}),

		updateStats: definePacket({
			reliabilityType: "reliable",
			value: struct({
				statAmount: ByteNet.int8,
				statMaxAmount: ByteNet.int8,
				statType: ByteNet.string as ByteNetType<"hunger" | "thirst">,
			}),
		}),

		deleteReplicatedEntity: definePacket({
			reliabilityType: "reliable",
			value: ByteNet.unknown as ByteNetType<Entity>,
		}),

		// for replicating to all players
		getReplicatedComponents: definePacket({
			reliabilityType: "reliable",
			value: ByteNet.nothing,
		}),

		...({
			Body: definePacket({
				reliabilityType: "reliable",
				value: struct({
					data: optional(
						struct({
							animator: ByteNet.inst as ByteNetType<Animator | Instance>,
							head: ByteNet.inst as ByteNetType<BasePart | Instance>,
							humanoid: ByteNet.inst as ByteNetType<Humanoid | Instance>,
							model: ByteNet.inst as ByteNetType<Instance | Model>,
							rootAttachment: ByteNet.inst as ByteNetType<Attachment | Instance>,
							rootPart: ByteNet.inst as ByteNetType<BasePart | Instance>,
						}),
					),
					serverEntity: ByteNet.unknown as ByteNetType<Entity>,
				}),
			}),
		} satisfies {
			[k in keyof typeof componentsToReplicate]: packet<
				struct<{
					data: optional<MapTableToByteNet<ComponentDataFromEntity<MappedComponents[k]>>>;
					serverEntity: ByteNetType<Entity>;
				}>
			>;
		}),
	};
});

export const routes = {} as { [key in keyof typeof packets]: (typeof packets)[key] };

for (const [key, packet] of pairs(packets)) {
	const toBeCalled = new Set<(...args: Array<unknown>) => void>();

	const routeFaked = routes as unknown as Record<string, unknown>;

	routeFaked[key] = {
		listen: (callback: (...args: Array<unknown>) => void) => {
			toBeCalled.add(callback);
			return () => toBeCalled.delete(callback);
		},
		send: packet.send,
		sendTo: packet.sendTo,
		sendToAll: packet.sendToAll,
		sendToAllExcept: packet.sendToAllExcept,
		sendToList: packet.sendToList,
		wait: packet.wait,
	};

	packet.listen((...T: Array<unknown>) => {
		toBeCalled.forEach((callback: Callback) => callback(...T));
	});
}
