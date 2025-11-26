import { useState } from "react";
import { OppgaveId, OppgaveV2 } from "./oppgaveTypes";
import { Button, Heading, Modal, Select, Skeleton } from "@navikt/ds-react";
import { http } from "../io/HttpClient";

export function EndreOppgaveModal(props: { oppgave: OppgaveV2; open: boolean; onClose(): void }) {
  const { oppgave, open, onClose } = props;
  const [behandlingstema, setBehandlingstema] = useState<string>(oppgave.kategorisering.behandlingstema?.kode ? oppgave.kategorisering.behandlingstema?.kode : "");
  // const [behandlingstype, setBehandlingstype] = useState<string>("");
  // const [alternativer, setAlternativer] = useState<GjelderAlternativerResponse>();
  const [loading] = useState<boolean>(false);

  // useEffect(() => {
  // TODO: Hent gjelder info fra backend når API er klart

  // if (open) {
  //   const fetchGjelderInfo = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch(`/api/oppgaver-v2/${oppgave.oppgaveId}/gjelder`)
  //       const data = await response.json()
  //       setBehandlingstema(data.behandlingstema)
  //       setBehandlingstype(data.behandlingstype)
  //       setAlternativer(data.alternativer)
  //       console.log(data)
  //     } catch (error) {
  //       console.error('Error med å hente gjelder info:', error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchGjelderInfo()
  // }
  // }, [open, oppgave.oppgaveId]);

  const oppdaterTema = (oppgaveId: OppgaveId, nyttBehandlingstema: string, versjon: number) => {
    http
      .put(`/api/oppgaver-v2/${oppgaveId}`, { behandlingstema: nyttBehandlingstema }, { versjon: versjon.toString() })
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
            <Select label="Endre behandlingstema" value={behandlingstema} onChange={(e) => setBehandlingstema(e.target.value)}>
              {behandlingstemaer
                .sort((a, b) => a.term.localeCompare(b.term))
                .map((alternativ) => (
                  <option key={alternativ.kode} value={alternativ.kode}>
                    {alternativ.term}
                  </option>
                ))}
            </Select>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="primary" size="small" onClick={() => oppdaterTema(oppgave.oppgaveId, behandlingstema, oppgave.versjon)}>
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

export const behandlingstemaer = [
  {
    "kode": "ab0537",
    "term": "Arbeidsstoler, sittemøbler og bord"
  },
  {
    "kode": "ab0427",
    "term": "Behandlingsbriller/linser ordinære vilkår"
  },
  {
    "kode": "ab0428",
    "term": "Behandlingsbriller/linser særskilte vilkår"
  },
  {
    "kode": "ab0536",
    "term": "Bevegelse"
  },
  {
    "kode": "ab0420",
    "term": "Briller til barn"
  },
  {
    "kode": "ab0317",
    "term": "Briller/linser"
  },
  {
    "kode": "ab0539",
    "term": "Elektrisk rullestol"
  },
  {
    "kode": "ab0523",
    "term": "Filterbriller"
  },
  {
    "kode": "ab0550",
    "term": "Ganghjelpemiddel"
  },
  {
    "kode": "ab0378",
    "term": "Henvisning"
  },
  {
    "kode": "ab0562",
    "term": "Hygiene"
  },
  {
    "kode": "ab0376",
    "term": "Hørsel"
  },
  {
    "kode": "ab0373",
    "term": "IT"
  },
  {
    "kode": "ab0538",
    "term": "Innredning kjøkken og bad"
  },
  {
    "kode": "ab0429",
    "term": "Irislinser"
  },
  {
    "kode": "ab0535",
    "term": "Kalendere og planleggingsverktøy"
  },
  {
    "kode": "ab0541",
    "term": "Kjørepose og regncape"
  },
  {
    "kode": "ab0542",
    "term": "Kjørerampe"
  },
  {
    "kode": "ab0372",
    "term": "Kognisjon"
  },
  {
    "kode": "ab0464",
    "term": "Kommunikasjon"
  },
  {
    "kode": "ab0245",
    "term": "Lese- og sekretærhjelp"
  },
  {
    "kode": "ab0566",
    "term": "Lese- og skrivestøtte"
  },
  {
    "kode": "ab0547",
    "term": "Madrasser trykksårforebyggende"
  },
  {
    "kode": "ab0545",
    "term": "Manuell rullestol"
  },
  {
    "kode": "ab0215",
    "term": "Ombygging /tilrettelegging arbeid"
  },
  {
    "kode": "ab0546",
    "term": "Omgivelseskontroll"
  },
  {
    "kode": "ab0540",
    "term": "Overflytting, vending og posisjonering"
  },
  {
    "kode": "ab0552",
    "term": "Personløfter og løftesete"
  },
  {
    "kode": "ab0443",
    "term": "Regning lese- og sekretærhjelp"
  },
  {
    "kode": "ab0558",
    "term": "Sansestimulering"
  },
  {
    "kode": "ab0548",
    "term": "Seng"
  },
  {
    "kode": "ab0555",
    "term": "Sittepute"
  },
  {
    "kode": "ab0544",
    "term": "Sittesystem"
  },
  {
    "kode": "ab0549",
    "term": "Stol med oppreisning"
  },
  {
    "kode": "ab0551",
    "term": "Ståstativ"
  },
  {
    "kode": "ab0556",
    "term": "Sykkel"
  },
  {
    "kode": "ab0377",
    "term": "Syn"
  },
  {
    "kode": "ab0561",
    "term": "Tilskudd"
  },
  {
    "kode": "ab0557",
    "term": "Tilskudd PC"
  },
  {
    "kode": "ab0560",
    "term": "Tilskudd apper"
  },
  {
    "kode": "ab0559",
    "term": "Tilskudd småhjelpemidler"
  },
  {
    "kode": "ab0543",
    "term": "Trappeheis og løfteplattform"
  },
  {
    "kode": "ab0553",
    "term": "Varmehjelpemiddel"
  },
  {
    "kode": "ab0370",
    "term": "Varsling og alarm"
  },
  {
    "kode": "ab0554",
    "term": "Vogn og sportsutstyr"
  }
];