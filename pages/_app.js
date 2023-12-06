import { CartContextProvider } from "@/components/CartContext"
import { createGlobalStyle } from "styled-components"
import { SessionProvider } from "next-auth/react"

const GlobalStyles = createGlobalStyle`

body{
  background-color:#f0f0f0;
  padding:0;
  margin:0;
  font-family: 'Poppins', sans-serif;
  background-color:white;
}

hr{
  display: block;
  border:0;
  border-top: 1px solid #ddd;

}
`

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <GlobalStyles />
      <SessionProvider session={session}>
        <CartContextProvider>
          <Component {...pageProps} />
        </CartContextProvider>
      </SessionProvider>
    </>
  )
}
