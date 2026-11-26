import { describe, expect, it, vi } from 'vitest'
import { Mottakertype, Målform, type Brevmottaker } from '../../brevTyper'
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
    expect(html).toContain('med-formidlerkopi')
    expect(html.indexOf('Kommunal hjelpemiddelformidler:')).toBeLessThan(html.indexOf('Saken gjelder:'))
    expect(html).toContain('<dd>Ola Formidler</dd>')
  })

  it('viser verge før formidler og bruker nynorsk-tekster', () => {
    const html = byggHeaderHtml(metadata, 'Verge Vergesen', formidler, Målform.NYNORSK, true)
    expect(html.indexOf('Verje:')).toBeLessThan(html.indexOf('Kommunal hjelpemiddelformidlar:'))
    expect(html.indexOf('Kommunal hjelpemiddelformidlar:')).toBeLessThan(html.indexOf('Saken gjeld:'))
  })

  it('viser ingen formidlerlinje når formidler mangler', () => {
    const html = byggHeaderHtml(metadata, '', undefined, Målform.BOKMÅL, true)
    expect(html).not.toContain('Kommunal hjelpemiddelformidler:')
    expect(html).toContain('<dt>Navn:</dt>')
  })

  it('viser kopi til bruker kun for innhentingsbrev med bruker som mottaker', () => {
    const html = byggHeaderHtml(metadata, '', formidler, Målform.BOKMÅL, true, true)
    expect(html).toContain('<dt>Kopi til:</dt><dd>Kari Nordmann</dd>')
  })

  it('viser ikke kopi til bruker som standard, ved verge alene eller i andre brevmaler', () => {
    const utenBruker = byggHeaderHtml(metadata, '', formidler, Målform.BOKMÅL, true)
    const vergeAlene = byggHeaderHtml(metadata, '', formidler, Målform.BOKMÅL, true, false)
    const annenMal = byggHeaderHtml(metadata, '', formidler, Målform.BOKMÅL, false, true)

    expect(utenBruker).not.toContain('<dt>Kopi til:</dt>')
    expect(vergeAlene).not.toContain('<dt>Kopi til:</dt>')
    expect(annenMal).not.toContain('<dt>Kopi til:</dt>')
    expect(annenMal).toContain('Kopi til kommunal hjelpemiddelformidler')
  })

  it('bruker kopi til-label på bokmål og nynorsk', () => {
    const bokmål = byggHeaderHtml(metadata, '', formidler, Målform.BOKMÅL, true, true)
    const nynorsk = byggHeaderHtml(metadata, '', formidler, Målform.NYNORSK, true, true)

    expect(bokmål).toContain('<dt>Kopi til:</dt>')
    expect(nynorsk).toContain('<dt>Kopi til:</dt>')
  })

  it('escaper brukers navn i kopi til-linjen', () => {
    const html = byggHeaderHtml(
      { ...metadata, brukersNavn: 'Kari <Nordmann & Co>' },
      '',
      formidler,
      Målform.BOKMÅL,
      true,
      true
    )

    expect(html).toContain('<dt>Kopi til:</dt><dd>Kari &lt;Nordmann &amp; Co&gt;</dd>')
    expect(html).not.toContain('<dt>Kopi til:</dt><dd>Kari <Nordmann & Co></dd>')
  })
})
