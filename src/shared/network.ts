import ByteNet, { bool, defineNamespace, definePacket, optional, struct } from "@rbxts/bytenet";
import { Entity } from "@rbxts/jecs";
import { componentsToReplicate } from "./utils/jecs/components";
import { ComponentDataFromEntity, MappedComponents } from "./utils/functions/jecsHelpFunctions";

export type packet<T extends ByteNetType<unknown>> = ReturnType<typeof ByteNet.definePacket<T>>;
export type optional<T extends ByteNetType<unknown>> = ReturnType<typeof ByteNet.optional<T>>;
export type struct<T extends { [index: string]: ByteNetType<unknown> }> = ReturnType<typeof ByteNet.struct<T>>;
export type ByteNetType<T> = {
	value: T;
};
type Vector3Net = ReturnType<typeof ByteNet.vec3> & ByteNetType<Vector3>;

type MapTableToByteNet<T> =
	T extends Instance ? ByteNetType<T | Instance> :
	T extends Array<infer U> ? ByteNetType<Array<MapTableToByteNet<U>['value']>> :
	T extends object ? struct<{ [newKey in keyof T]: MapTableToByteNet<T[newKey]> }> :
	ByteNetType<T>;

export const packets = defineNamespace("Packets", () => {
	return {


		updateInventory: definePacket({
			value: ByteNet.unknown as ByteNetType<Inventory>,
			reliabilityType: "reliable"
		}),

		// for replicating to all players
		getReplicatedComponents: definePacket({
			value: ByteNet.nothing,
			reliabilityType: "reliable",
		}),

		deleteReplicatedEntity: definePacket({
			value: ByteNet.unknown as ByteNetType<Entity>,
			reliabilityType: "reliable",
		}),

		...({
			Body: definePacket({
				value: struct({
					serverEntity: ByteNet.unknown as ByteNetType<Entity>,
					data: optional(
						struct({
							model: ByteNet.inst as ByteNetType<Instance | Model>,
							humanoid: ByteNet.inst as ByteNetType<Instance | Humanoid>,
							rootPart: ByteNet.inst as ByteNetType<Instance | BasePart>,
							head: ByteNet.inst as ByteNetType<Instance | BasePart>,
							rootAttachment: ByteNet.inst as ByteNetType<Instance | Attachment>,
							animator: ByteNet.inst as ByteNetType<Instance | Animator>,
						}),
					),
				}),
				reliabilityType: "reliable",
			}),
		} satisfies {
			[k in keyof typeof componentsToReplicate]: packet<
				struct<{
					serverEntity: ByteNetType<Entity>;
					data: optional<MapTableToByteNet<ComponentDataFromEntity<MappedComponents[k]>>>;
				}>
			>;
		}),
	};
});

export const routes = {} as { [key in keyof typeof packets]: (typeof packets)[key] };

for (const [key, packet] of pairs(packets)) {
	const toBeCalled = new Set<(...args: unknown[]) => void>();

	const routeFaked = routes as unknown as Record<string, unknown>;

	routeFaked[key] = {
		wait: packet.wait,
		send: packet.send,
		sendToAll: packet.sendToAll,
		sendTo: packet.sendTo,
		sendToList: packet.sendToList,
		sendToAllExcept: packet.sendToAllExcept,
		listen: (callback: (...args: unknown[]) => void) => {
			toBeCalled.add(callback);
			return () => toBeCalled.delete(callback);
		},
	};

	packet.listen((...T: unknown[]) => {
		toBeCalled.forEach((callback: Callback) => callback(...T));
	});
}