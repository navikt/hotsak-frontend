import { BodyShort, Label, Detail } from '@navikt/ds-react'

export const Tekst: React.FC = ({ children }) => {
  return <BodyShort size="s">{children}</BodyShort>
}

export const Etikett: React.FC = ({ children }) => {
  return <Label size="s">{children}</Label>
}

export const Undertittel: React.FC = ({ children }) => {
  return <Detail size="s">{children}</Detail>
}
