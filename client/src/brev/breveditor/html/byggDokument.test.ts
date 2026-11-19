import { describe, expect, it, vi } from 'vitest'
import { Målform, Mottakertype, type Brevmottaker } from '../../brevTyper'
import { byggHeaderHtml } from './byggDokument'

vi.mock('../versjonerte-brev-stilark/v1.less?raw', () => ({ default: '' }))

const metadata = {
  brukersNavn: 'Kari Nordmann',
  brukersFødselsnummer: '01010112345',
  saksnummer: 1,
  brevOpprettet: '19. november 2026',
  saksbehandlerNavn: 'Saksbehandler',
  hjelpemiddelsentral: 'Nav hjelpemiddelsentral',
}
const formidler = { navn: 'Ola Formidler', mottakertype: Mottakertype.FORMIDLER } as Brevmottaker

describe('byggHeaderHtml', () => {
  it('viser formidler som kopimottaker nederst som standard', () => {
    const html = byggHeaderHtml(metadata, '', formidler, Målform.BOKMÅL)
    expect(html).toContain('Kopi til kommunal hjelpemiddelformidler')
    expect(html).toContain('med-formidlerkopi')
    expect(html).toContain('<dt>Navn:</dt>')
  })

  it('viser formidler øverst og saken gjelder når formidler er mottaker', () => {
    const html = byggHeaderHtml(metadata, '', formidler, Målform.BOKMÅL, true)
    expect(html).not.toContain('Kopi til')
    expect(html).not.toContain('med-formidlerkopi')
    expect(html.indexOf('Formidler:')).toBeLessThan(html.indexOf('Saken gjelder:'))
    expect(html).toContain('<dd>Ola Formidler</dd>')
  })

  it('viser verge før formidler og bruker nynorsk-tekster', () => {
    const html = byggHeaderHtml(metadata, 'Verge Vergesen', formidler, Målform.NYNORSK, true)
    expect(html.indexOf('Verje:')).toBeLessThan(html.indexOf('Formidlar:'))
    expect(html.indexOf('Formidlar:')).toBeLessThan(html.indexOf('Saken gjeld:'))
  })

  it('viser ingen formidlerlinje når formidler mangler', () => {
    const html = byggHeaderHtml(metadata, '', undefined, Målform.BOKMÅL, true)
    expect(html).not.toContain('Formidler:')
    expect(html).toContain('<dt>Navn:</dt>')
  })
})
