import { useState, useEffect } from 'react';
import { app } from './firebase-config';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import Chatroom from './components/Chatroom';
import Home from './components/Home';

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

function App() {
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log(user);
      } else {
        setUser(null);
      }
    });
  }, []);
  const handleSignInWithGoogle = async () => {
    signInWithPopup(auth, provider)
      .then((result: any) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        console.log('Sign In')
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log('Sign In Error');
      });
  }

  const handleLogOut = async () => {
    signOut(auth).then(() => {
      console.log('Sign Out');
    }).catch((error) => {
      console.log('Sign Out Error');
    });
  };

  const toggleTheme = () => {
    setTheme((curr) => (curr === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`h-[100vh] w-[100vw] ${theme === 'light' ? 'text-black' : 'text-white bg-neutral-800'}`}>
      <header className="border-b h-[10%] flex justify-between items-center">
        <div className="flex justify-between items-center ml-2">
          <span className="mr-1">ChatApp</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>

        <div className="flex justify-between items-center mr-[2vw]">
          <button onClick={toggleTheme} className="mr-[2vw]">
            {theme === 'light' ?
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg> :
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>}
          </button>
          {user ?
            <button onClick={handleLogOut} className="bg-blue-400 rounded p-[.5vh] flex justify-center items-center h-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button> :
            <button onClick={handleSignInWithGoogle} className="bg-blue-400 rounded p-[.5vh] flex justify-center items-center h-full">Sign in</button>
          }
        </div>
      </header>
      <main className="h-[90%]">
        {user ?
          <Chatroom user={user} theme={theme} /> :
          <Home />
        }
      </main>
    </div>
  );
}

export default App;
