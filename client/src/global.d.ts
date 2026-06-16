declare type ID = string | number
declare type Maybe<T> = T | undefined
declare type Nullable<T> = T | null

// Java Time-typer
declare type Instant = string
declare type LocalDate = string
declare type LocalDateTime = string
declare type OffsetDateTime = string
declare type ZonedDateTime = string

declare type Enum<T extends object> = T[keyof T]

declare module '@navikt/ds-css'
