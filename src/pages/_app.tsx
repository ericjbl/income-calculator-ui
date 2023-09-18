// import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import AuthProvider from 'providers/AuthProvider'
import AuthVerify from 'providers/AuthVerify';
import React from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const requireAuth = (Component as any).requireAuthentication ?? true;
  return (
    <AuthProvider requireAuth={requireAuth}>
      <Component {...pageProps} />
      <AuthVerify />
    </AuthProvider>
  )
}
