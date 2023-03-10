import { ThemeProvider } from 'styled-components'
import { useState } from 'react'
import { defaultTheme } from './styles/themes/default'
import { GlobalStyle } from './styles/Global'

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <h1>Ignite it</h1>
      <GlobalStyle/>
    </ThemeProvider>
  )
}