import { InfoCard } from '@navikt/ds-react'
import { ReactNode } from 'react'
import { TextContainer } from './typografi'
import sharedStyles from '../styles/shared.module.css'
import styles from './systemalert.module.css'

export function SystemAlert({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <TextContainer className={`${sharedStyles.center} ${styles.container}`}>
      <InfoCard data-color="info" size="small">
        <InfoCard.Header>
          <InfoCard.Title>{title}</InfoCard.Title>
        </InfoCard.Header>
        <InfoCard.Content>{children}</InfoCard.Content>
      </InfoCard>
    </TextContainer>
  )
}
