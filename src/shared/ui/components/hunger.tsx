import Vide, { Derivable, read } from "@rbxts/vide";
import { imageIds, positions } from "../constants";
import { usePx } from "../hooks/use-px";

export function Hunger({ progress }: { progress: Derivable<number> }): Vide.Node {
    const px = usePx()
    const hungerSize = () => UDim2.fromScale(read(progress), 1)

    return <imagelabel
        Name="BarBackground"
        AnchorPoint={() => new Vector2(0.5, 0.5)}
        Image={imageIds.bar.hunger_background}
        BackgroundTransparency={1}
        Size={() => UDim2.fromOffset(px(250), px(45))}
        Position={() => positions.bottomCenter.add(UDim2.fromOffset(0, -px(50)))}
    >
        <imagelabel
            Name="BarBehind"
            AnchorPoint={() => new Vector2(0.5, 0.5)}
            Image={imageIds.bar.hunger_bar}
            BackgroundTransparency={1}
            ImageTransparency={1}
            Size={() => UDim2.fromScale(0.98, 0.95)}
            Position={() => UDim2.fromScale(0.5, 0.5)}
        >
            <imagelabel
                Name="Bar"
            AnchorPoint={() => new Vector2(0, 1)}
            Image={imageIds.bar.hunger_bar}
            BackgroundTransparency={1}
            Size={() => hungerSize()}
            Position={() => UDim2.fromScale(0, 1)}
            />
        </imagelabel>

        <imagelabel
            Name="Icon"
            AnchorPoint={() => new Vector2(0.5, 0.5)}
            Image={imageIds.bar.hunger_icon}
            BackgroundTransparency={1}
            Size={() => UDim2.fromOffset(px(50), px(50))}
            Position={() => UDim2.fromScale(1, 0.5)}
        />

    </imagelabel>
}