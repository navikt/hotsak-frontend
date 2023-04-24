import { OppgaveStatusType, Oppgavetype, Saksoversikt } from '../../types/types.internal'

const saksoversikt: Saksoversikt[] = [
  {
    hotsakSaker: [
      {
        sakstype: Oppgavetype.BESTILLING,
        mottattDato: '2021-09-19T13:55:45Z',
        område: ['bevegelse'],
        søknadGjelder: 'Rullator',
        status: OppgaveStatusType.FERDIGSTILT,
        statusEndretDato: '2021-09-20T14:59:45Z',
        saksbehandler: 'Silje Saksbehandler',
        fagsystem: 'HOTSAK',
        sakId: '1000',
      },
      {
        sakstype: Oppgavetype.SØKNAD,
        mottattDato: '2021-08-18T13:55:45Z',
        område: ['kognisjon'],
        søknadGjelder: 'Kalender',
        status: OppgaveStatusType.TILDELT_SAKSBEHANDLER,
        statusEndretDato: '2021-08-18T13:55:45Z',
        saksbehandler: 'Silje Saksbehandler',
        fagsystem: 'HOTSAK',
        sakId: '1001',
      },
      {
        sakstype: Oppgavetype.SØKNAD,
        mottattDato: '2021-09-19T13:55:45Z',
        område: ['bevegelse'],
        søknadGjelder: 'Rullator',
        status: OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
        statusEndretDato: '2021-09-20T14:59:45Z',
        fagsystem: 'HOTSAK',
        sakId: '1002',
      },
    ],
  },
  {
    hotsakSaker: [
      {
        sakstype: Oppgavetype.BESTILLING,
        mottattDato: '2021-09-19T13:55:45Z',
        område: ['bevegelse'],
        søknadGjelder: 'Rullator',
        status: OppgaveStatusType.FERDIGSTILT,
        statusEndretDato: '2021-09-20T14:59:45Z',
        saksbehandler: 'Silje Saksbehandler',
        fagsystem: 'HOTSAK',
        sakId: '1003',
      },
      {
        sakstype: Oppgavetype.BESTILLING,
        mottattDato: '2021-09-19T13:55:45Z',
        område: ['bevegelse'],
        søknadGjelder: 'Rullator',
        status: OppgaveStatusType.AVVIST,
        statusEndretDato: '2021-09-20T14:59:45Z',
        saksbehandler: 'Silje Saksbehandler',
        fagsystem: 'HOTSAK',
        sakId: '1004',
      },
      {
        sakstype: Oppgavetype.SØKNAD,
        mottattDato: '2021-08-18T13:55:45Z',
        område: ['kognisjon'],
        søknadGjelder: 'Kalender',
        status: OppgaveStatusType.TILDELT_SAKSBEHANDLER,
        statusEndretDato: '',
        saksbehandler: 'Silje Saksbehandler',
        fagsystem: 'HOTSAK',
        sakId: '1005',
      },
      {
        sakstype: Oppgavetype.SØKNAD,
        mottattDato: '2021-09-19T13:55:45Z',
        område: ['bevegelse'],
        søknadGjelder: 'Rullator',
        status: OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
        statusEndretDato: '',
        fagsystem: 'HOTSAK',
        sakId: '1006',
      },
    ],
  },
  {
    hotsakSaker: [
      {
        sakstype: Oppgavetype.BESTILLING,
        mottattDato: '2021-09-19T13:55:45Z',
        område: ['bevegelse'],
        søknadGjelder: 'Rullator',
        status: OppgaveStatusType.FERDIGSTILT,
        statusEndretDato: '2021-09-20T14:59:45Z',
        saksbehandler: 'Silje Saksbehandler',
        fagsystem: 'HOTSAK',
        sakId: '1007',
      },
      {
        sakstype: Oppgavetype.SØKNAD,
        mottattDato: '2021-09-19T13:55:45Z',
        område: ['bevegelse'],
        søknadGjelder: 'Rullator',
        status: OppgaveStatusType.VEDTAK_FATTET,
        statusEndretDato: '2021-09-20T14:59:45Z',
        saksbehandler: 'Silje Saksbehandler',
        fagsystem: 'HOTSAK',
        sakId: '1008',
      },
      {
        sakstype: Oppgavetype.SØKNAD,
        mottattDato: '2021-08-18T13:55:45Z',
        område: ['kognisjon'],
        søknadGjelder: 'Kalender',
        status: OppgaveStatusType.TILDELT_SAKSBEHANDLER,
        statusEndretDato: '',
        saksbehandler: 'Silje Saksbehandler',
        fagsystem: 'HOTSAK',
        sakId: '1009',
      },
      {
        mottattDato: '2021-09-19T13:55:45Z',
        område: ['bevegelse'],
        søknadGjelder: 'Rullator',
        status: OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
        statusEndretDato: '',
        fagsystem: 'HOTSAK',
        sakId: '1010',
      },
    ],
  },
]

export class SaksoversiktStore {
  constructor() {
    // todo
  }

  async alle() {
    return saksoversikt
  }
}
