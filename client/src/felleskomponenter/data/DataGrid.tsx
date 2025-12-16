import { HStack, Loader, Table, type TableProps } from '@navikt/ds-react'
import { type Key, type ReactNode, useState } from 'react'

import { isKeyOfObject } from '../../utils/type.ts'
import { FormatDate } from '../format/FormatDate.tsx'
import { FormatDateTime } from '../format/FormatDateTime.tsx'
import { DataGridFilterMenu } from './DataGridFilterMenu.tsx'
import { type DataGridFilter } from './DataGridFilter.ts'

export interface DataGridColumn<T extends object> {
  field: string | Exclude<keyof T, symbol | number>

  header?: string
  hidden?: boolean
  sortKey?: Exclude<keyof T, symbol | number>
  width?: number
  order?: number

  filter?: DataGridFilter

  formatDate?: boolean
  formatDateTime?: boolean

  renderHeader?(): ReactNode
  renderCell?(row: T): ReactNode
}

export interface DataGridProps<T extends object> extends TableProps {
  rows: T[]
  columns: DataGridColumn<T>[]
  textSize?: 'medium' | 'small'
  emptyMessage?: string
  loading?: boolean

  keyFactory(row: T): Exclude<Key, bigint>
  renderContent?(row: T, visible: boolean): ReactNode
}

export function DataGrid<T extends object>(props: DataGridProps<T>) {
  const {
    rows,
    columns,
    textSize,
    emptyMessage = 'Ingen data funnet',
    loading,
    keyFactory,
    renderContent,
    ...tableProps
  } = props
  const colSpan = renderContent ? columns.length + 1 : columns.length
  return (
    <Table {...tableProps}>
      <Table.Header>
        <Table.Row>
          {renderContent ? <Table.HeaderCell /> : null}
          {columns.filter(notHidden).map((column) => {
            const key = column.field

            let header: ReactNode
            if (column.renderHeader) {
              header = column.renderHeader()
            } else if (column.header) {
              header = column.header
            }

            if (column.sortKey) {
              return (
                <Table.ColumnHeader
                  key={key}
                  textSize={textSize}
                  sortKey={column.sortKey}
                  style={{ width: column.width, whiteSpace: 'nowrap' }}
                  sortable
                >
                  {header}
                </Table.ColumnHeader>
              )
            } else {
              return (
                <Table.HeaderCell key={key} textSize={textSize} style={{ width: column.width, whiteSpace: 'nowrap' }}>
                  <HStack align="center" gap="1" wrap={false}>
                    <div>{header}</div>
                    {column.filter ? <DataGridFilterMenu field={column.field} filter={column.filter} /> : null}
                  </HStack>
                </Table.HeaderCell>
              )
            }
          })}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length === 0 && loading && (
          <PlaceholderRow colSpan={colSpan} textSize={textSize}>
            <Loader />
          </PlaceholderRow>
        )}
        {rows.length === 0 && !loading && (
          <PlaceholderRow colSpan={colSpan} textSize={textSize}>
            {emptyMessage}
          </PlaceholderRow>
        )}
        {rows.map((row) => {
          const key = keyFactory(row)

          const cells = columns.filter(notHidden).map((column) => {
            let value: ReactNode
            if (column.renderCell) {
              value = column.renderCell(row)
            } else if (isKeyOfObject(column.field, row)) {
              if (column.formatDate) {
                value = <FormatDate date={row[column.field] as string} />
              } else if (column.formatDateTime) {
                value = <FormatDateTime dateTime={row[column.field] as string} />
              } else {
                value = <>{row[column.field]}</>
              }
            }

            return (
              <Table.DataCell key={column.field} textSize={textSize} width={column.width}>
                {value}
              </Table.DataCell>
            )
          })

          if (renderContent) {
            return (
              <ExpandableRow key={key} renderContent={renderContent} row={row}>
                {cells}
              </ExpandableRow>
            )
          } else {
            return <Table.Row key={key}>{cells}</Table.Row>
          }
        })}
      </Table.Body>
    </Table>
  )
}

function notHidden<T extends object>(column: DataGridColumn<T>): boolean {
  return !column.hidden
}

function PlaceholderRow({
  colSpan,
  textSize,
  children,
}: {
  colSpan: number
  textSize?: 'medium' | 'small'
  children: ReactNode
}) {
  return (
    <Table.Row>
      <Table.DataCell colSpan={colSpan} textSize={textSize} align="center" style={{ padding: 10 }}>
        {children}
      </Table.DataCell>
    </Table.Row>
  )
}

function ExpandableRow<T extends object>({
  renderContent,
  row,
  children,
}: {
  renderContent: NonNullable<DataGridProps<T>['renderContent']>
  row: T
  children: ReactNode
}) {
  const [visible, setVisible] = useState<boolean>(false)
  return (
    <Table.ExpandableRow content={renderContent(row, visible)} open={visible} onOpenChange={setVisible}>
      {children}
    </Table.ExpandableRow>
  )
}
