import { Button, Modal, Table } from '@navikt/ds-react'
import { Vergemål } from '../types/types.internal'
import { formaterNavn, storForbokstavIOrd } from '../utils/formater'

export function VergeInformasjonsModal({
  modalRef,
  vergemål,
}: {
  modalRef: React.RefObject<HTMLDialogElement | null>
  vergemål: Vergemål[]
}) {
  return (
    <Modal ref={modalRef} header={{ heading: 'Vergemål' }} width="1000px">
      <Modal.Body>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Type</Table.HeaderCell>
              <Table.HeaderCell scope="col">Omfang</Table.HeaderCell>
              <Table.HeaderCell scope="col">Tjenesteområde</Table.HeaderCell>
              <Table.HeaderCell scope="col">Verge navn</Table.HeaderCell>
              <Table.HeaderCell scope="col">Verge fødselsnummer</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {vergemål.map((vergemål, i) => {
              const { vergeEllerFullmektig } = vergemål
              return (
                <Table.Row key={i}>
                  <Table.DataCell>{vergemål.type ? storForbokstavIOrd(vergemål.type) : '-'}</Table.DataCell>
                  <Table.DataCell>
                    {vergeEllerFullmektig.omfang ? storForbokstavIOrd(vergeEllerFullmektig.omfang) : '-'}
                  </Table.DataCell>
                  <Table.DataCell>
                    {vergeEllerFullmektig.tjenesteomraade
                      ?.map((tjeneste) =>
                        tjeneste.tjenesteoppgave
                          ? storForbokstavIOrd(tjeneste.tjenesteoppgave) +
                            (tjeneste.tjenestevirksomhet
                              ? ' ' + '(' + storForbokstavIOrd(tjeneste.tjenestevirksomhet) + ')'
                              : '')
                          : '-'
                      )
                      .join(', ') || '-'}
                  </Table.DataCell>
                  <Table.DataCell>
                    {vergeEllerFullmektig.identifiserendeInformasjon?.navn
                      ? formaterNavn(vergeEllerFullmektig.identifiserendeInformasjon.navn)
                      : '-'}
                  </Table.DataCell>
                  <Table.DataCell>{vergeEllerFullmektig.motpartsPersonident || '-'}</Table.DataCell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => modalRef.current?.close()}>
          Lukk
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
