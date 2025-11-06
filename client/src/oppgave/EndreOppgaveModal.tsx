import { useEffect, useState } from "react";
import { GjelderAlternativerResponse, OppgaveId, OppgaveV2 } from "./oppgaveTypes";
import { Button, Heading, Modal, Select, Skeleton } from "@navikt/ds-react";
import { http } from "../io/HttpClient";

export function EndreOppgaveModal(props: { oppgave: OppgaveV2; open: boolean; onClose(): void }) {
  const { oppgave, open, onClose } = props;
  const [behandlingstema, setBehandlingstema] = useState<string>("");
  const [behandlingstype, setBehandlingstype] = useState<string>("");
  const [alternativer, setAlternativer] = useState<GjelderAlternativerResponse>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      const fetchGjelderInfo = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/oppgaver-v2/${oppgave.oppgaveId}/gjelder`)
          const data = await response.json()
          setBehandlingstema(data.behandlingstema)
          setBehandlingstype(data.behandlingstype)
          setAlternativer(data.alternativer)
          console.log(data)
        } catch (error) {
          console.error('Error med å hente gjelder info:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchGjelderInfo()
    }
  }, [open, oppgave.oppgaveId]);

  const oppdaterTema = (oppgaveId: OppgaveId, nyttBehandlingstema: string) => {
    http
      .put(`/api/oppgaver-v2/${oppgaveId}`, { behandlingstema: nyttBehandlingstema })
      .then(() => {
        console.log('Behandlingstema oppdatert')
      })
      .finally(() => {
        onClose()
      })
  }

  return (
    <>
      <Modal
        closeOnBackdropClick={false}
        width="500px"
        open={open}
        onClose={onClose}
        size="small"
        aria-label={"Endre oppgave"}
      >
        <Modal.Header>
          <Heading level="1" size="small">
            {"Endre oppgave"}
          </Heading>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <>
              <Skeleton height={52} />
              <Skeleton height={52} />
              <Skeleton height={134} />
            </>
          ) : (
            (behandlingstema && behandlingstype && alternativer) && (
              <>
                <Select label="Endre behandlingstema" value={behandlingstema} onChange={(e) => setBehandlingstema(e.target.value)}>
                  {alternativer.alternativer
                    .sort((a, b) => a.behandlingstemaTerm.localeCompare(b.behandlingstemaTerm))
                    .map((alternativ) => (
                      <option key={alternativ.behandlingstemaKode} value={alternativ.behandlingstemaKode}>
                        {alternativ.behandlingstemaTerm}
                      </option>
                    ))}
                </Select>
              </>
            )
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="primary" size="small" onClick={() => oppdaterTema(oppgave.oppgaveId, behandlingstema)}>
            {"Lagre endringer"}
          </Button>
          <Button type="reset" variant="secondary" size="small" onClick={onClose}>
            {"Avbryt"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}