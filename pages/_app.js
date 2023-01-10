import { appWithTranslation } from 'next-i18next'
import { SessionProvider } from "next-auth/react"
import { createTheme, NextUIProvider } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/react';

import '../styles/globals.css'

const lightTheme = createTheme({
  type: 'light',
  theme: {
    colors: {
      inactive: '#787f85',
      bright: '#000',
      dark: '#fff',
    },
  }
})

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {
      inactive: '#787f85',
      bright: '#fff',
      dark: '#000',
    },
  }
})

function App({ Component, pageProps }) {
  return <NextThemesProvider
    defaultTheme="dark" //system
    attribute="class"
    value={{
      light: lightTheme.className,
      dark: darkTheme.className
    }}
  >
    <NextUIProvider>
      <Component {...pageProps} />
      <Analytics />
    </NextUIProvider>
  </NextThemesProvider>;
}

const AppWithI18n = appWithTranslation(App);

const AppWithAuth = (props) => (
  <SessionProvider session={props.pageProps.session}>
    <AppWithI18n {...props} />
  </SessionProvider>
);

export default AppWithAuth;
