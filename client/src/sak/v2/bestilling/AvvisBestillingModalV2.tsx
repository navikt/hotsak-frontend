import { Radio, RadioGroup, Textarea } from '@navikt/ds-react'

import classes from './AvvisBestillingModalV2.module.css'

import { Controller, useForm } from 'react-hook-form'
import { Tekst } from '../../../felleskomponenter/typografi'
import { useOppgave } from '../../../oppgave/useOppgave'
import { BekreftelsesDialog } from '../../../saksbilde/komponenter/BekreftelsesDialog'
import { Bestillingsresultat } from '../behandling/behandlingTyper'
import { useBehandlingActions } from '../behandling/useBehandlingActions'

export interface AvvisBestillingModalV2Props {
  open: boolean
  onClose(): void
}

export function AvvisBestillingModalV2({ open, onClose }: AvvisBestillingModalV2Props) {
  const { oppgave } = useOppgave()
  const { opprettOgferdigstillBestillingBehandling } = useBehandlingActions()
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ defaultValues: { valgtÅrsak: '', begrunnelse: '' } })

  const handleBekreft = handleSubmit(async (data) => {
    await opprettOgferdigstillBestillingBehandling.trigger({
      oppgaveId: oppgave?.oppgaveId,
      utfall: {
        type: 'BESTILLING',
        utfall: Bestillingsresultat.AVVIST,
        avvisningsårsak: {
          årsak: data.valgtÅrsak,
          begrunnelse: data.begrunnelse,
        },
      },
    })
    onClose()
  })

  return (
    <BekreftelsesDialog
      heading="Vil du avvise bestillingen?"
      open={open}
      loading={opprettOgferdigstillBestillingBehandling.isMutating}
      bekreftButtonLabel="Avvis bestillingen"
      onBekreft={handleBekreft}
      onClose={onClose}
    >
      <Tekst>
        Bestillingen avvises i Hotsak. Bruker og formidler vil se oppdatert status på nav.no innen neste virkedag. Det
        er ikke behov for å gjøre noe videre med saken i Gosys.
      </Tekst>
      <Controller
        control={control}
        name="valgtÅrsak"
        rules={{ required: 'Du må velge en årsak i listen over.' }}
        render={({ field }) => (
          <RadioGroup
            className={classes.avvisBestillingRadioGroup}
            legend="Velg årsak til at bestillingen avvises"
            error={errors.valgtÅrsak?.message}
            size="small"
            {...field}
          >
            <Tekst>Brukes kun internt av teamet som utvikler Hotsak, og vises ikke til bruker.</Tekst>
            {avvisÅrsaker.map((årsak, index) => (
              <Radio key={årsak} value={årsak} data-cy={`avvis-bestilling-arsak-${index}`}>
                {årsak}
              </Radio>
            ))}
          </RadioGroup>
        )}
      />
      <Textarea
        label="Begrunnelse for å avvise bestillingen"
        description="Unngå personopplysninger. Begrunnelsen lagres som en del av sakshistorikken. Svarene kan også bli brukt i videreutvikling av løsningen."
        size="small"
        error={errors.begrunnelse?.message}
        {...register('begrunnelse', {
          validate: (value, { valgtÅrsak }) =>
            valgtÅrsak !== 'Annet' ||
            value.trim() !== '' ||
            'Du må skrive en begrunnelse for hvorfor bestillingen avvises',
        })}
      />
    </BekreftelsesDialog>
  )
}

const avvisÅrsaker: ReadonlyArray<string> = ['Duplikat av en annen bestilling', 'Annet']
