import { useState, useEffect, useRef } from 'react';
import { app } from '../firebase-config'
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { doc, onSnapshot } from "firebase/firestore";

interface Message {
  message: string;
  name: string;
  photoURL: string;
  userID: string;
  date: number;
};

const db = getFirestore(app);

function Chatroom({ user, theme }: { user: any, theme: string }) {
  const messageInput = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("date"));
    onSnapshot(q, (querySnapshot) => {
      const tempMessage: Message[] = [];
      querySnapshot.forEach((doc) => {
        const res: Message = {
          message: doc.data().message,
          name: doc.data().name,
          photoURL: doc.data().photoURL,
          userID: doc.data().userID,
          date: doc.data().date,
        };
        tempMessage.push(res);
      });
      setMessages(tempMessage);
    });
  }, []);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const message = messageInput.current ? messageInput.current.value : '';

    if (!message) return;
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        name: user.displayName,
        photoURL: user.photoURL,
        userID: user.uid,
        message: message,
        date: Date.now(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    if (messageInput.current) {
      messageInput.current.value = '';
    }
  };

  return (
    <>
      <div className="landscape:h-[90%] portrait:h-[92%] overflow-scroll">
        {messages.map((e, key) => {
          return (<div key={key} className="flex justify-left items-start m-2">
            <img src={e.photoURL} className="w-[3rem] rounded mr-2"></img>
            <div className="flex flex-col">
              <div>{e.name}</div>
              <div>{e.message}</div>
            </div>
          </div>
          )
        })}
      </div>
      <form onSubmit={(e) => handleSendMessage(e)}
        className="landscape:h-[10%] portrait:h-[8%] flex justify-center items-center">
        <input ref={messageInput} placeholder="Aa"
          className={`w-5/6 h-full pl-2 text-lg outline-none ${theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-700'}`}></input>
        <button className="w-1/6 bg-blue-400 flex justify-center items-center h-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </>
  );
}

export default Chatroom;
