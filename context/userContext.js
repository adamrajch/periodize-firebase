import { useState, useEffect, createContext, useContext } from "react";
import { firebaseApp } from "../firebase/clientApp";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "@firebase/auth";

const db = getFirestore(firebaseApp);
export const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const auth = getAuth();
  const [user, setUser] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userDoc = await getDoc(doc(db, "users", `${user.uid}`));
          if (userDoc.exists()) {
            setUser(userDoc.data());
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, loading, error }} {...props} />;
};

export const useAuthState = () => {
  const auth = useContext(AuthContext);
  return { ...auth, isAuthenticated: auth.user != null };
};
