import { Loader, Table, type TableProps } from '@navikt/ds-react'
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
        {rows.length === 0 && !loading && (
          <Table.Row>
            <Table.DataCell colSpan={colSpan} style={{ textAlign: 'center' }} textSize={textSize}>
              {emptyMessage}
            </Table.DataCell>
          </Table.Row>
        )}
        {rows.length === 0 && loading && (
          <Table.Row>
            <Table.DataCell colSpan={colSpan} style={{ textAlign: 'center' }} textSize={textSize}>
              <Loader />
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
