import { getAuth, updateEmail, updateProfile } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import Dashboard from "../../components/shell/dashboard";
import { useAuthState } from "../../context/userContext";
export default function Profile(): ReactElement {
  const { user, loading } = useAuthState();
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (user && !loading) {
      setUsername(user.userData.displayName);
      setPhoto(user.userData.photoURL);
      setEmail(user.userData.email);
    }
  }, [loading, user]);
  const db = getFirestore();
  const auth = getAuth();

  async function updateEmailAddress() {
    updateEmail(auth.currentUser, email)
      .then(async () => {
        // Email updated!
        // ...
        await updateDoc(doc(db, "users", user.userData.uid), {
          "userData.email": email,
        });

        router.push("/dashboard/profile");
      })
      .catch((error) => {
        // An error occurred
        // ...
        alert(error);
      });
  }
  function updateNameAndImage(e) {
    e.preventDefault();
    console.log(username, photo);
    if (username.length > 0) {
      updateProfile(auth.currentUser, {
        displayName: username,
        photoURL: photo,
      })
        .then(async () => {
          // Profile updated!
          // ...
          await updateDoc(doc(db, "users", user.userData.uid), {
            "userData.displayName": username,
            "userData.photoURL": photo,
          });

          router.push("/dashboard/profile");
        })
        .catch((error) => {
          alert(error);
        });
    }
  }
  return (
    <div>
      <Dashboard>
        {loading && (
          <div className=" flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        )}
        {user && !loading && (
          <>
            <div>
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Profile
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      This information will be displayed publicly so be careful
                      what you share.
                    </p>
                  </div>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6 flex items-center justify-between">
                      <div className="w-3/4">
                        <label
                          htmlFor="email-address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email address
                        </label>
                        <input
                          type="text"
                          name="email-address"
                          id="email-address"
                          autoComplete="email"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          placeholder={user.userData.email}
                          readOnly
                        />
                      </div>

                      <div className="px-4 py-3  text-right sm:px-6">
                        <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden sm:block" aria-hidden="true">
              <div className="py-5">
                <div className="border-t border-gray-200" />
              </div>
            </div>

            <div className="mt-10 sm:mt-0">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Personal Information
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Use a permanent address where you can receive mail.
                    </p>
                  </div>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <form>
                    <div className="shadow overflow-hidden sm:rounded-md">
                      <div className="px-4 py-5 bg-white sm:p-6">
                        <div className="grid grid-cols-6 gap-6">
                          <div className="col-span-6 sm:col-span-4">
                            <label
                              htmlFor="displayName"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Display Name
                            </label>
                            <input
                              type="text"
                              name="display-name"
                              id="display-name"
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                            />
                          </div>
                          <div className="col-span-6 sm:col-span-4">
                            <label
                              htmlFor="displayName"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Photo URL
                            </label>
                            <input
                              type="text"
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              value={photo}
                              onChange={(e) => setPhoto(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button
                          onClick={(e) => updateNameAndImage(e)}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </Dashboard>
    </div>
  );
}
