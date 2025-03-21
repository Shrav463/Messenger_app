import React, { useState } from 'react';
import { SendOutlined, PictureOutlined } from '@ant-design/icons';
import { db, storage } from '../firebase'; // Import db and storage from Firestore
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import storage functions

const MessageForm = (props) => {
    const [value, setValue] = useState('');
    const { chatId, userName } = props; // Assuming you pass chatId and userName

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const text = value.trim();

        if (text.length > 0) {
            try {
                await addDoc(collection(db, `chats/${chatId}/messages`), {
                    text: text,
                    sender: userName,
                    timestamp: serverTimestamp(), // Use Firestore serverTimestamp
                });
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }

        setValue('');
    };

    const handleUpload = async (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const storageRef = ref(storage, `images/${file.name}`);

            try {
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);

                await addDoc(collection(db, `chats/${chatId}/messages`), {
                    text: '',
                    sender: userName,
                    timestamp: serverTimestamp(),
                    file: downloadURL,
                });
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    };

    return (
        <form className="message-form" onSubmit={handleSubmit}>
            <input
                className="message-input"
                placeholder="Send a message..."
                value={value}
                onChange={handleChange}
                onSubmit={handleSubmit}
            />
            <label htmlFor="upload-button">
                <span className="image-button">
                    <PictureOutlined className="picture-icon" />
                </span>
            </label>
            <input
                type="file"
                multiple={false}
                id="upload-button"
                style={{ display: 'none' }}
                onChange={handleUpload}
            />
            <button type="submit" className="send-button">
                <SendOutlined className="send-icon" />
            </button>
        </form>
    );
};

export default MessageForm;