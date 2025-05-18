import ReactDOM from "react-dom/client";
import { CometChatUIKit, UIKitSettingsBuilder } from "@cometchat/chat-uikit-react";

import App  from "./App.tsx";
import cometChatLogo from "../src/CometChat/assets/cometchat_logo.svg";
import { setupLocalization } from "./CometChat/utils/utils";
import { BuilderSettingsProvider } from "./CometChat/context/BuilderSettingsContext";



export const COMETCHAT_CONSTANTS = {
  APP_ID: "275462bca32a5030", 
  REGION: "IN", 
  AUTH_KEY: "4b2806558572c43e98c4930b380302231090e6f9", 
};

if (
  COMETCHAT_CONSTANTS.APP_ID &&
  COMETCHAT_CONSTANTS.REGION &&
  COMETCHAT_CONSTANTS.AUTH_KEY
){
const UIKitSettings = new UIKitSettingsBuilder().setAppId(COMETCHAT_CONSTANTS.APP_ID).setRegion(COMETCHAT_CONSTANTS.REGION).setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY).subscribePresenceForAllUsers().build();
  
CometChatUIKit.init(UIKitSettings)!
  .then(() => {
    setupLocalization();
    const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement
  );
  root.render(
    <BuilderSettingsProvider>
      <App/>
    </BuilderSettingsProvider>
  );
});
} else {
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );
  root.render(
    <div className= "App" style={{gap: "20px"}}>
      <div className="cometchat-credentials__logo">
        <img src={cometChatLogo} alt="CometChat Logo" />
    </div>
    <div className="cometchat-credentials__header">
      CometChat App credentials are missing. Please add tem in{" "}
    </div>
  </div>

  );
}