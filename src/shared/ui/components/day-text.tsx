import Vide, { type Derivable, read, type Source } from "@rbxts/vide";

import { anchorPoints, positions } from "../constants";
import { usePx } from "../hooks/use-px";
import { Palette } from "../palette";

export interface DayTextProps {
	readonly alignX?: Derivable<Enum.TextXAlignment>;
	readonly alignY?: Derivable<Enum.TextYAlignment>;
	readonly anchorPoint?: Derivable<Vector2>;
	readonly backgroundTransparency?: Derivable<number>;
	readonly children?: Vide.Node;
	readonly font?: Derivable<Enum.Font>;
	readonly layoutOrder?: Derivable<number>;
	readonly name?: Derivable<string>;
	readonly position?: Derivable<UDim2>;
	readonly size?: Derivable<UDim2>;
	readonly text: Derivable<string>;
	readonly textBounds?: Source<Vector2>;
	readonly textColor?: Derivable<Color3>;
	readonly textScaled?: Derivable<boolean>;
	readonly textSize?: Derivable<number>;
	readonly transparency?: Derivable<number>;
}

const DEFAULT_FONT = Enum.Font.LuckiestGuy;
const DEFAULT_TEXT_SIZE = 14;

export function DayText({
	alignX,
	alignY,
	anchorPoint,
	backgroundTransparency,
	children,
	font,
	layoutOrder,
	name,
	position,
	size,
	text,
	textBounds,
	textColor,
	textScaled,
	textSize,
	transparency,
}: DayTextProps): Vide.Node {
	const isDefaultFont = () => read(font) === undefined || read(font) === DEFAULT_FONT;
	const getPosition = () => read(position) ?? positions.center;
	const getTextSize = () => read(textSize) ?? DEFAULT_TEXT_SIZE;
	const px = usePx();

	return (
		<textlabel
			Name={name}
			AnchorPoint={() => read(anchorPoint) ?? anchorPoints.center}
			Position={() =>
				isDefaultFont() ? getPosition().add(UDim2.fromOffset(0, getTextSize() / px(5))) : getPosition()
			}
			Text={() => (isDefaultFont() ? read(text).upper() : read(text))}
			TextSize={getTextSize}
			TextScaled={textScaled}
			TextColor3={() => read(textColor) ?? Palette.yellow}
			TextXAlignment={alignX}
			TextYAlignment={alignY}
			BackgroundTransparency={() => read(backgroundTransparency) ?? 1}
			Size={() => read(size) ?? UDim2.fromScale(1, 1)}
			Font={() => read(font) ?? Enum.Font.LuckiestGuy}
			TextTransparency={transparency}
			LayoutOrder={layoutOrder}
			TextBoundsChanged={textBounds}
		>
			{children}
		</textlabel>
	);
}
