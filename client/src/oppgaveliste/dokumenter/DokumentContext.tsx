import React, { useContext, useState } from 'react'

type DokumentContextType = {
  valgtDokumentID: string
  setValgtDokumentID: (valgtDokumentID: string) => void
}

const initialState = {
  valgtDokumentID: '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setValgtDokumentID: () => {},
}

const DokumentContext = React.createContext<DokumentContextType>(initialState)

const DokumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [valgtDokumentID, setValgtDokumentID] = useState(initialState.valgtDokumentID)

  return <DokumentContext.Provider value={{ valgtDokumentID, setValgtDokumentID }}>{children}</DokumentContext.Provider>
}

function useDokumentContext(): DokumentContextType {
  const context = useContext(DokumentContext)

  if (!context) {
    throw new Error('useDokumentContext must be used within a DokumentProvider')
  }

  return context
}

export { DokumentContext, DokumentProvider, useDokumentContext }
