import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import db from Firestore
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore'; // Import Firestore functions
import MyMessage from './MyMessage';
import TheirMessage from './TheirMessage';
import MessageForm from './MessageForm';

const ChatFeed = ({ activeChat }) => {
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]); // Messages as an array
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (!activeChat) return;

        const chatRef = doc(db, `chats/${activeChat}`); // Firestore doc
        const messagesRef = collection(db, `chats/${activeChat}/messages`); // Firestore collection
        const q = query(messagesRef, orderBy('timestamp')); // Order messages by timestamp
        const userRef = doc(db, 'users/your-user-id'); // Replace with actual user ID

        const chatListener = onSnapshot(chatRef, (snapshot) => { // Firestore onSnapshot
            setChat({ id: snapshot.id, ...snapshot.data() });
        });

        const messagesListener = onSnapshot(q, (snapshot) => { // Firestore onSnapshot
            const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(messagesData);
        });

        const userListener = onSnapshot(userRef, (snapshot) => { // Firestore onSnapshot
            const userData = snapshot.data();
            if (userData) {
                setUserName(userData.username);
            }
        });

        return () => {
            chatListener(); // Unsubscribe from listeners
            messagesListener();
            userListener();
        };
    }, [activeChat]);

    const renderReadReceipts = (message, isMyMessage) => {
        return chat && chat.people.map((person, index) => (
            person.last_read === message.id && (
                <div
                    key={`read_${index}`}
                    className="read-receipt"
                    style={{
                        float: isMyMessage ? 'right' : 'left',
                        backgroundImage: person.person.avatar && `url(${person.person.avatar})`,
                    }}
                />
            )
        ));
    };

    const renderMessages = () => {
        return messages.map((message, index) => {
            const lastMessage = index > 0 ? messages[index - 1] : null;
            const isMyMessage = userName === message.sender;

            return (
                <div key={`msg_${index}`} style={{ width: '100%' }}>
                    <div className="message-block">
                        {isMyMessage
                            ? <MyMessage message={message} />
                            : <TheirMessage message={message} lastMessage={lastMessage} />}
                    </div>
                    <div className="read-receipts" style={{ marginRight: isMyMessage ? '18px' : '0px', marginLeft: isMyMessage ? '0px' : '68px' }}>
                        {renderReadReceipts(message, isMyMessage)}
                    </div>
                </div>
            );
        });
    };

    if (!chat) return <div />;

    return (
        <div className="chat-feed">
            <div className="chat-title-container">
                <div className="chat-title">{chat?.title}</div>
                <div className="chat-subtitle">
                    {chat.people.map((person) => ` ${person.person.username}`)}
                </div>
            </div>
            {renderMessages()}
            <div style={{ height: '100px' }} />
            <div className="message-form-container">
                <MessageForm activeChat={activeChat} userName={userName} />
            </div>
        </div>
    );
};

export default ChatFeed;