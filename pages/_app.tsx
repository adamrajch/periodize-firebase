import type { AppProps } from "next/app";
import Head from "next/head";
import React, { useEffect } from "react";
import "tailwindcss/tailwind.css";
import { AuthContextProvider } from "../context/userContext";
function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Periodize</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
    </React.Fragment>
  );
}

export default MyApp;
