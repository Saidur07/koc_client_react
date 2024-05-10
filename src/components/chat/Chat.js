import React, { useEffect, useState } from 'react';
import { TUIKit } from '@tencentcloud/chat-uikit-react';
import { TUILogin } from '@tencentcloud/tui-core';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import genTestUserSig from './helper/GenerateTestUserSig';

const Chat = () => {
    const [chat, setChat] = useState();

    const init = () => {
        const userID = `test1`;
        const loginInfo = {
            SDKAppID: genTestUserSig(userID).SDKAppID,
            userID: 'test1',
            userSig: genTestUserSig(userID).userSig,
            useUploadPlugin: true,
            useProfanityFilterPlugin: true,
        };
        console.log(loginInfo)
        TUILogin.login(loginInfo).then((res) => {
            const { chat } = TUILogin.getContext();
            setChat(chat);
        });
    }
    useEffect(() => {
        (async () => {
            const chat = await init()
            setChat(chat)
        })()
    }, [])
    return (
        <div>
            <TUIKit chat={chat} language={'en'}></TUIKit> 
        </div>
    );
};

export default Chat;