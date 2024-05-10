"use client";
import React, { useEffect, useState } from "react";
import { TUIKit } from "@tencentcloud/chat-uikit-react";
import { TUILogin } from "@tencentcloud/tui-core";
import "@tencentcloud/chat-uikit-react/dist/cjs/index.css";
import genTestUserSig from "../../helper/GenerateTestUserSig";
import { useSelector } from "react-redux";

const Chat = () => {
  const [chat, setChat] = useState();
  const userProfile = useSelector((state) => state.user.data);

  const init = () => {
    const loginInfo = {
      SDKAppID: genTestUserSig(userProfile?.user?._id).SDKAppID,
      userID: userProfile?.user?._id,
      userSig: genTestUserSig(userProfile?.user?._id).userSig,
      useUploadPlugin: true,
      useProfanityFilterPlugin: true,
    };
    console.log(loginInfo);
    TUILogin.login(loginInfo).then((res) => {
      const { chat } = TUILogin.getContext();
      setChat(chat);
    });
  };
  useEffect(() => {
    (async () => {
      const chat = await init();
      setChat(chat);
    })();
  }, []);
  return (
    <div>
      <TUIKit chat={chat} language={"en"}></TUIKit>
    </div>
  );
};

export default Chat;
