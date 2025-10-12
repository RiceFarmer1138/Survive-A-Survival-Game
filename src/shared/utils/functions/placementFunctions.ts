import RotatedRegion3 from "@rbxts/fast-rotated-region3";

export const areItemsOverlapping = (models: BasePart[], itemModel: TowVehiclePartModel, itemPivot: CFrame = itemModel.GetPivot(), itemSize: Vector3 = itemModel.Size) => {
    const region = new RotatedRegion3(itemPivot, itemSize)


    for (const model of models) {
        const hitBox = model as BasePart
        const position = model.Position

        if (model === itemModel) continue

        if (hitBox && (position === itemPivot.Position || region.CastPart(hitBox))) return true;
    }

    return false
}