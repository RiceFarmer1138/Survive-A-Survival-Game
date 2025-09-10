import { Janitor } from "@rbxts/janitor";
import { ReplicatedStorage } from "@rbxts/services";
import { PagePaths } from "shared/utils/ui/ui-paths";
import shopPage from "./pages/shopPage";
import hotbarsPage from "./pages/hotbarsPage";

export default (pagePaths: PagePaths) => {
        const trash = new Janitor();
        const pages = [
            shopPage,
            hotbarsPage
        ]


        pages.forEach((page) => trash.Add(page(pagePaths)));

        // when trash gets cleaned up
        trash.Add(() => {
                ReplicatedStorage.FindFirstChild("BytenetStorage")?.Destroy();
                ReplicatedStorage.FindFirstChild("ByteNetReliable")?.Destroy();
                ReplicatedStorage.FindFirstChild("ByteNetUnreliable")?.Destroy();
        })

        return trash
}