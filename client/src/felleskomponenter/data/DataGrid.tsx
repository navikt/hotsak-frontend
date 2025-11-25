import { Table, type TableProps } from '@navikt/ds-react'
import { type Key, type ReactNode, useState } from 'react'

import { isKeyOfObject } from '../../utils/type.ts'

export interface DataGridColumn<T extends object> {
  field: string | Exclude<keyof T, symbol>

  header?: string
  hidden?: boolean
  sortKey?: Exclude<keyof T, symbol | number>
  width?: number

  renderHeader?(): ReactNode
  renderCell?(row: T): ReactNode
}

export interface DataGridProps<T extends object> extends TableProps {
  rows: T[]
  columns: DataGridColumn<T>[]
  textSize?: 'medium' | 'small'
  emptyMessage?: string

  keyFactory(row: T): Exclude<Key, bigint>
  renderContent?(row: T, expanded: boolean): ReactNode
}

export function DataGrid<T extends object>(props: DataGridProps<T>) {
  const {
    rows,
    columns,
    textSize,
    emptyMessage = 'Ingen data funnet',
    keyFactory,
    renderContent,
    ...tableProps
  } = props
  const [expanded, setExpanded] = useState<Record<Exclude<Key, bigint>, boolean>>({})
  return (
    <Table {...tableProps}>
      <Table.Header>
        <Table.Row>
          {renderContent ? <Table.HeaderCell /> : null}
          {columns.map((column) => {
            const key = column.field

            let header: ReactNode
            if (column.renderHeader) {
              header = column.renderHeader()
            } else if (column.header) {
              header = <>{column.header}</>
            }

            if (column.sortKey) {
              return (
                <Table.ColumnHeader
                  key={key}
                  textSize={textSize}
                  sortKey={column.sortKey}
                  style={{ width: column.width }}
                  sortable
                >
                  {header}
                </Table.ColumnHeader>
              )
            } else {
              return (
                <Table.HeaderCell key={key} textSize={textSize} style={{ width: column.width }}>
                  {header}
                </Table.HeaderCell>
              )
            }
          })}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length == 0 && (
          <Table.Row>
            <Table.DataCell
              colSpan={renderContent ? columns.length + 1 : columns.length}
              style={{ textAlign: 'center' }}
              textSize={textSize}
            >
              {emptyMessage}
            </Table.DataCell>
          </Table.Row>
        )}
        {rows.map((row) => {
          const key = keyFactory(row)

          const cells = columns.map((column) => {
            let value: ReactNode
            if (column.renderCell) {
              value = column.renderCell(row)
            } else if (isKeyOfObject(column.field, row)) {
              value = <>{row[column.field]}</>
            }

            return (
              <Table.DataCell key={column.field} textSize={textSize} width={column.width}>
                {value}
              </Table.DataCell>
            )
          })

          if (renderContent) {
            return (
              <Table.ExpandableRow
                key={key}
                content={renderContent(row, expanded[key])}
                onOpenChange={(value) => {
                  setExpanded({ ...expanded, [key]: value })
                }}
              >
                {cells}
              </Table.ExpandableRow>
            )
          } else {
            return <Table.Row key={key}>{cells}</Table.Row>
          }
        })}
      </Table.Body>
    </Table>
  )
}
