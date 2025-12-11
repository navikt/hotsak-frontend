import { Button, ButtonProps } from '@navikt/ds-react'
import { type NavigateOptions, type To, useNavigate } from 'react-router-dom'

export interface LinkButtonProps extends ButtonProps {
  to: To
  options?: NavigateOptions
}

export function LinkButton(props: LinkButtonProps) {
  const { to, options, ...rest } = props
  const navigate = useNavigate()
  return <Button {...rest} onClick={() => navigate(to, options)} />
}
