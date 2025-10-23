export function getCharacterParts(body?: Model): [Humanoid, BasePart, BasePart, Animator, Attachment] {
	const humanoid = body?.FindFirstChild("Humanoid") as Humanoid;
	const rootPart = body?.FindFirstChild("HumanoidRootPart") as BasePart;
	const head = body?.FindFirstChild("Head") as BasePart;
	const animator = humanoid?.FindFirstChild("Animator") as Animator;
	const rootAttachment = rootPart?.FindFirstChild("RootAttachment") as Attachment;

	// if all parts exist then return them all
	return [humanoid, rootPart, head, animator, rootAttachment];
}
