import { appWithTranslation } from 'next-i18next'
import { SessionProvider } from "next-auth/react"
import { createTheme, NextUIProvider } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from 'next-themes';

const lightTheme = createTheme({
  type: 'light',
  theme: {
    colors: {
      inactive: '#787f85'
    },
  }
})

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {
      inactive: '#787f85'
    },
  }
})

function App({ Component, pageProps }) {
  return <NextThemesProvider
    defaultTheme="system"
    attribute="class"
    value={{
      light: lightTheme.className,
      dark: darkTheme.className
    }}
  >
    <NextUIProvider>
      <Component {...pageProps} />
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
