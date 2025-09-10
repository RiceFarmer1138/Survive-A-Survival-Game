import RotatedRegion3 from "@rbxts/fast-rotated-region3";

export const areItemsOverlapping = (models: Model[], itemModel: TowVehiclePartModel, itemPivot: CFrame = itemModel.GetPivot(), itemSize: Vector3 = itemModel.GetExtentsSize()) => {
    const region = new RotatedRegion3(itemPivot, itemSize)


    for (const model of models) {
        const hitBox = model.PrimaryPart!
        const position = model.GetPivot().Position;

        if (model === itemModel) continue

        if (hitBox && (position === itemPivot.Position || region.CastPart(hitBox))) return true;
    }

    return false
}