import { App } from "@serverless-stack/resources";
import { MyStack } from "./MyStack";
import { ApiAuthRoutesStack } from "./ApiAuth";

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "services",
    bundle: {
      format: "esm",
    },
  });
  app.stack(MyStack);
  app.stack(ApiAuthRoutesStack);
}
