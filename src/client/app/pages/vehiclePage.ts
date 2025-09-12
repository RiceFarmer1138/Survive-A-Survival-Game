import { Janitor } from "@rbxts/janitor";
import { PagePaths } from "shared/utils/ui/ui-paths";
import useEffect from "../hooks/use-effect";
import { routes } from "shared/network";

export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const launchButton = pagePaths.Launch.LaunchButton

    trash.Add(launchButton.Activated.Connect((inputObj) => {
        if (inputObj.UserInputType === Enum.UserInputType.Touch || inputObj.UserInputType === Enum.UserInputType.MouseButton1) {
            routes.launchVehicle.send()
            print("launching")
        }
    }))

    return trash
}