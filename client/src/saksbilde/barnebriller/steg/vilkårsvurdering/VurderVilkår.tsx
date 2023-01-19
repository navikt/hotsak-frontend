import { useBrillesak } from '../../../sakHook'

export const VurderVilkår: React.FC = () => {
  const { sak, isLoading, isError } = useBrillesak()
  return (
    <>
      <div>Da har vi kommet til {`${sak?.steg}`}</div>
      <pre>{JSON.stringify(sak)}</pre>
    </>
  )
}
