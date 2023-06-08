import React, { useContext, useState } from 'react'

type ValgtDokumentType = {
  journalpostID: string
  dokumentID: string
}

type DokumentContextType = {
  valgtDokument: ValgtDokumentType
  setValgtDokument: (valgtDokument: ValgtDokumentType) => void
}

const initialState = {
  valgtDokument: { journalpostID: '', dokumentID: '' },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setValgtDokument: () => {},
}

const DokumentContext = React.createContext<DokumentContextType>(initialState)

const DokumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [valgtDokument, setValgtDokument] = useState(initialState.valgtDokument)

  return <DokumentContext.Provider value={{ valgtDokument, setValgtDokument }}>{children}</DokumentContext.Provider>
}

function useDokumentContext(): DokumentContextType {
  const context = useContext(DokumentContext)

  if (!context) {
    throw new Error('useDokumentContext must be used within a DokumentProvider')
  }

  return context
}

export { DokumentContext, DokumentProvider, useDokumentContext }
