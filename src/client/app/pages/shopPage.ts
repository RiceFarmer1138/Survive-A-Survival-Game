import { Janitor } from "@rbxts/janitor";
import { PagePaths } from "shared/utils/ui/ui-paths";
import useEffect from "../hooks/use-effect";
import pageStates from "shared/utils/ui/state";
import { MarketplaceService, TweenService } from "@rbxts/services";
import { routes } from "shared/network";
import { LocalPlayer } from "client/constants";

const formatDuration = (totalSeconds: number) => {
    if (totalSeconds < 0) totalSeconds = -totalSeconds

    const secondsInMinute = 60
    const secondsInHour = 60 * secondsInMinute
    const secondsInDay = 24 * secondsInHour
    const secondsInMonth = 30 * secondsInDay

    const months = math.floor(totalSeconds / secondsInMonth)
    const days = math.floor((totalSeconds % secondsInMonth) / secondsInDay)
    const hours = math.floor((totalSeconds % secondsInDay) / secondsInHour)
    const minutes = math.floor((totalSeconds % secondsInHour) / secondsInMinute)
    const seconds = math.floor(totalSeconds % secondsInMinute)

    const parts = new Array<string>();
    if (months > 0) { parts.push(months + "mo") }
    if (days > 0) { parts.push(days + "d") }
    if (hours > 0) { parts.push(hours + "h") }
    if (minutes > 0) { parts.push(minutes + "m") }
    parts.push(seconds + "s")

    return parts.reduce((newString, oldString) => newString + " " + oldString)
}

export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const shop = pagePaths.Shop
    const container = shop.MainLayout
    const restockTimer = container.NewBlockLayout.Restock
    const restockButton = container.NewBlockLayout.RestockButton
    const close = container.NewBlockLayout.X
    const partsContainer = container.ScrollingFrame
    const buyFrame = partsContainer.UIListLayout.BuyFrame
    const buyFrameSize = buyFrame.Size
    const openPosition = container.Position
    const buyFrameTweeninfo = new TweenInfo(0.65, Enum.EasingStyle.Bounce, Enum.EasingDirection.Out)
    const closedPosition = UDim2.fromScale(openPosition.X.Scale, 3.5);

    function renderParts() {
        const stockedParts = pageStates.restockedParts()
        if (stockedParts.isEmpty()) return;
        
        partsContainer.GetChildren().forEach((frame) => frame.IsA("Frame") && frame.Name !== "BuyFrame" && frame.Destroy())
        // sort it from cheaapest to most expensive
        // stockedParts.sort((a, b) => a.Price < b.Price)

        stockedParts.forEach((vehiclePartInfo, vehiclePartIndex) => {
            const vehiclePartImage = vehiclePartInfo.Image
            const buyFocus = pageStates.buyFocus()
            const vehiclePartBox = shop[vehiclePartInfo.Rarity].Clone()

            vehiclePartBox.Layout.PictureFrame.PictureFrame.ItemImage.Image = vehiclePartImage
            vehiclePartBox.Layout.ItemName.Text = vehiclePartInfo.Name
            vehiclePartBox.Layout.ItemPrice.Text = `$${vehiclePartInfo.Price}`
            vehiclePartBox.Layout.ItemStock.Text = `x${vehiclePartInfo.InStock} Stock`
            vehiclePartBox.Layout.Description.Text = vehiclePartInfo.Description
            vehiclePartBox.Visible = true

            vehiclePartBox.LayoutOrder = (vehiclePartIndex + 1) * 2
            vehiclePartBox.Parent = partsContainer

            vehiclePartBox.InputBegan.Connect((inputObj) => {
                if (inputObj.UserInputType === Enum.UserInputType.MouseButton1 || inputObj.UserInputType === Enum.UserInputType.Touch) {
                    pageStates.buyFocus({
                        visible: (buyFocus.selectedPartIndex === vehiclePartIndex && buyFocus.visible) ? false : true,
                        selectedPartIndex: vehiclePartIndex
                    })
                }
            })
        })
    }

    trash.Add(useEffect((newTrash) => {
        const buyFocus = pageStates.buyFocus()

        const tween = newTrash.Add(TweenService.Create(buyFrame, buyFrameTweeninfo, {
            Size: buyFocus.visible ? buyFrameSize : UDim2.fromScale(0, 0),
        }))

        buyFrame.LayoutOrder = (((buyFocus.selectedPartIndex ?? -1) + 1) * 2) + 1;
        buyFrame.Size = buyFocus.visible ? UDim2.fromScale(0, 0) : buyFrameSize;
        buyFrame.Parent = partsContainer
        tween.Play()
    }))

    trash.Add(useEffect((newTrash) => {
        const buyFocus = pageStates.buyFocus()
        const stockedParts = pageStates.restockedParts()
        const stockedPartsInfo = stockedParts[buyFocus.selectedPartIndex]
        
        if (stockedPartsInfo) {
            newTrash.Add(buyFrame.CoinsBuy.MouseButton1Click.Connect(() => {
                routes.buyPart.send(stockedPartsInfo)
            }))
        }
    }))

   // update restock time
   trash.Add(task.spawn(() => {
        while (true) {
            const restockTime = pageStates.restockTime();
            const formattedTime = formatDuration(restockTime);

            restockTimer.Text = `New Parts In ${formattedTime}`;
            task.wait(1)
        }
    }))

    trash.Add(useEffect((newTrash) => {
        const open = pageStates.openPage()

       newTrash.Add(TweenService.Create(container, new TweenInfo(0.3, Enum.EasingStyle.Cubic, Enum.EasingDirection.InOut), {
            Position: open === "Shop" ? openPosition : closedPosition,
        })).Play();
    }))

    trash.Add(close.MouseButton1Click.Connect(() => {
        pageStates.openPage("None")
    }))

    trash.Add(restockButton.MouseButton1Click.Connect(() => MarketplaceService.PromptProductPurchase(LocalPlayer, 3392251104)))

    /// reredenrs the parts shop once it restocked
    trash.Add(useEffect(() => {
        renderParts()
    }))

    return trash
}