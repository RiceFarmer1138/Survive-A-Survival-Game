import Vide, { type Derivable, read, type Source } from "@rbxts/vide";

import { anchorPoints, positions } from "../../constants";

interface ContainerProps {
	readonly absolutePositionChanged?: Source<Vector2>;
	readonly absoluteSizeChanged?: Source<Vector2>;
	readonly anchorPoint?: Derivable<Vector2>;
	readonly children?: Vide.Node;
	readonly clipsDescendants?: Derivable<boolean>;
	readonly layoutOrder?: Derivable<number>;
	readonly name?: Derivable<string>;
	readonly position?: Derivable<UDim2>;
	readonly visible?: Derivable<boolean>
	readonly size?: Derivable<UDim2>;
	readonly backgroundColor?: Derivable<Color3>;
	readonly transparency?: Derivable<number>;
}

/**
 * A component that represents an invisible frame. The container can house
 * children components and provides an offset to center the content.
 */
export function Container({
	absolutePositionChanged: absolutePosition,
	absoluteSizeChanged: absoluteSize,
	anchorPoint,
	children,
	clipsDescendants,
	layoutOrder,
	name,
	visible = true,
	position,
	size,
	backgroundColor = Color3.fromRGB(255, 255, 255),
	transparency,
}: ContainerProps): Vide.Node {
	return (
		<frame
			Name={() => read(name) ?? "ContainerFrame"}
			Position={() => read(position) ?? positions.center}
			AnchorPoint={() => read(anchorPoint) ?? anchorPoints.center}
			BackgroundTransparency={() => read(transparency) ?? 1}
			BackgroundColor3={() => read(backgroundColor)}
			Size={() => read(size) ?? UDim2.fromScale(1, 1)}
			ClipsDescendants={clipsDescendants}
			LayoutOrder={layoutOrder}
			AbsolutePositionChanged={absolutePosition}
			AbsoluteSizeChanged={absoluteSize}
			Visible={visible}
		>
			{children}
		</frame>
	);
}
