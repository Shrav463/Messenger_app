import React, { useState, useEffect } from 'react';
import ChatFeed from './components/ChatFeed';
import LoginForm from './components/LoginForm';
import './App.css';
import { auth, db } from './firebase';
import { doc, onSnapshot, collection } from 'firebase/firestore';

const App = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chats, setChats] = useState({});
    const [activeChat, setActiveChat] = useState(null);
    const [chatsLoading, setChatsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            console.log('Auth State Changed:', authUser);
            if (authUser) {
                console.log('User Logged In:', authUser.uid);
                setUser(authUser);
                try {
                    const userRef = doc(db, `users/${authUser.uid}`);
                    onSnapshot(userRef, (snapshot) => {
                        console.log('User Data Snapshot:', snapshot.data());
                        setUserData(snapshot.data());
                    });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                console.log('User Logged Out');
                setUser(null);
                setUserData(null);
            }
            console.log('Set Loading to False');
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        console.log('Chats useEffect Triggered');
        console.log('Current User UID:', auth.currentUser ? auth.currentUser.uid : 'No User Logged In');

        if (user && auth.currentUser) {
            console.log('User state:', user); // Check user state
            console.log('auth.currentUser inside chats useEffect:', auth.currentUser); // Check auth.currentUser here
            console.log("Before Firestore query"); // Check before query

            const chatsRef = collection(db, 'chats');
            onSnapshot(chatsRef, (snapshot) => {
                console.log('Chats Snapshot:', snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                const chatsData = {};
                snapshot.docs.forEach(doc => {
                    chatsData[doc.id] = doc.data();
                });
                if (chatsData && Object.keys(chatsData).length > 0) {
                    setChats(chatsData);
                    const chatIds = Object.keys(chatsData);
                    if (!activeChat || !chatsData[activeChat]) {
                        setActiveChat(chatIds[0]);
                    }
                } else {
                    setChats({});
                    setActiveChat(null);
                }
                console.log('Set Chats Loading to False');
                setChatsLoading(false);
            }, (error) => {
                console.error('Error fetching chats:', error);
                console.log('Set Chats Loading to False Due to Error');
                setChatsLoading(false);
            });
        } else {
            console.log('User not yet logged in or auth.currentUser is null, skipping chat fetch.');
        }
    }, [user, activeChat]);

    const handleChatSelect = (chatId) => {
        setActiveChat(chatId);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <LoginForm />;
    }

    if (chatsLoading) {
        return <div>Loading chats...</div>;
    }

    return (
        <div className="app-container">
            <div className="chat-list">
                {Object.keys(chats).map((chatId) => (
                    <div
                        key={chatId}
                        className={`chat-item ${activeChat === chatId ? 'active' : ''}`}
                        onClick={() => handleChatSelect(chatId)}
                    >
                        {chats[chatId].title}
                    </div>
                ))}
            </div>
            <div className="chat-window">
                {activeChat && <ChatFeed activeChat={activeChat} user={userData} />}
            </div>
        </div>
    );
};

export default App;