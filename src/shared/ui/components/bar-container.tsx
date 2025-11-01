import Vide, { type Derivable, type PropsWithChildren } from "@rbxts/vide";

interface BarContainerProps {
	readonly adornee: Derivable<BasePart>;
	readonly offset?: Derivable<Vector3>;
	readonly visible?: Derivable<boolean>;
}

export function BarContainer({ adornee, children, offset, visible }: PropsWithChildren<BarContainerProps>): Vide.Node {
	return (
		<billboardgui
			Name="SprintContainer"
			Active={true}
			Adornee={adornee}
			ClipsDescendants={true}
			LightInfluence={0}
			MaxDistance={80}
			SizeOffset={new Vector2(0, 0.5)}
			Size={UDim2.fromScale(0.5, 4.5)}
			StudsOffsetWorldSpace={offset ?? new Vector3(-3, -2, 0)}
			ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
			Enabled={visible ?? true}
		>
			{children}
		</billboardgui>
	);
}
