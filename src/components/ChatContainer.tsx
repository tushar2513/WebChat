import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore"
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
    const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unSubscribeToMessages } = useChatStore();
    const { authUser } = useAuthStore();
    const messageRef = useRef<HTMLDivElement>(null);

    interface Message {
        _id: string;
        text: string;
        image?: string;
        senderId: string;
        receiverId: string;
        createdAt: string;
    }

    useEffect(() => {
        getMessages(selectedUser._id);
        subscribeToMessages();

        return () => unSubscribeToMessages();
    }, [selectedUser._id, getMessages]) // getMessage why? always include a fn if it is defined in store, so if any changes takes place in fn the useEffect will re run help to utlize the latest fn 

    useEffect(() => {
        if (messageRef.current && messages)
            messageRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages]);

    if (isMessagesLoading) return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <MessageSkeleton />
            <MessageInput />
        </div>
    )

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {
                    messages.map((message: Message, index) => (
                        <div key={index}
                            className={`chat ${message.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`} ref={messageRef}>
                            <div className="chat-image avatar">
                                <div className="size-10 rounded-full border">
                                    <img src={message.senderId === authUser?._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || '/avatar.png'}
                                        alt="profile-pic" />
                                </div>
                            </div>

                            <div className="chat-bubble flex flex-col">
                                {message.image && (
                                    <img src={message.image} alt='Attachment' className="sm:max-w-[200px] rounded-md mb-2" />
                                )}
                                {message.text && <p>{message.text}</p>}
                            </div>

                            <div className="chat-header mb-1">
                                <time className="text-xs opacity-50 ml-1"> {formatMessageTime(message.createdAt)} </time>
                            </div>
                        </div>
                    ))
                }
            </div>

            <MessageInput />

        </div>
    )
}

export default ChatContainer