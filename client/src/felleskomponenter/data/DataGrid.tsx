import { HStack, Pagination, Skeleton, Table, type TableProps } from '@navikt/ds-react'
import clsx from 'clsx'
import { type Key, type ReactNode, useMemo, useState } from 'react'

import { isKeyOfObject } from '../../utils/type.ts'
import { FormatDate } from '../format/FormatDate.tsx'
import { FormatDateTime } from '../format/FormatDateTime.tsx'
import classes from './DataGrid.module.css'
import { type DataGridFilter } from './DataGridFilter.ts'
import type { DataGridFilterAction } from './DataGridFilterContext.ts'
import { DataGridFilterMenu } from './DataGridFilterMenu.tsx'

export interface DataGridColumn<T extends object> {
  field: string | Exclude<keyof T, symbol | number>

  header?: string
  hidden?: boolean
  sortKey?: Exclude<keyof T, symbol | number> | string
  width?: number
  order?: number

  /**
   * Only included in our test environment.
   */
  experiment?: boolean

  filter?: DataGridFilter

  formatDate?: boolean
  formatDateTime?: boolean

  renderHeader?(): ReactNode
  renderCell?(row: T): ReactNode
}

export interface DataGridProps<T extends object, K extends string = string> extends TableProps {
  rows: ReadonlyArray<T>
  columns: ReadonlyArray<DataGridColumn<T>>
  scope?: string
  textSize?: 'medium' | 'small'
  emptyMessage?: string
  loading?: boolean

  pagination?: boolean
  pageNumber?: number
  pageSize?: number

  keyFactory(row: T): Exclude<Key, bigint>
  renderContent?(props: DataGridContentProps<T>): ReactNode

  onFilterChange?(action: DataGridFilterAction<K>): void

  isHighlighted?(row: T): boolean
}

export function DataGrid<T extends object>(props: DataGridProps<T>) {
  const {
    rows,
    columns,
    scope = 'global',
    textSize,
    emptyMessage = 'Ingen data funnet',
    loading,
    pagination,
    pageNumber = 1,
    // pageSize = 50,
    keyFactory,
    renderContent,
    onFilterChange,
    isHighlighted,
    ...tableProps
  } = props
  const visibleColumns = useMemo(() => columns.filter(notHidden), [columns])
  const expandable = typeof renderContent === 'function'
  const colSpan = expandable ? visibleColumns.length + 1 : visibleColumns.length
  return (
    <Table {...tableProps}>
      <Table.Header>
        <Table.Row>
          {expandable ? <Table.HeaderCell style={{ width: 48 }} /> : null}
          {visibleColumns.map((column) => {
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
                  <HStack align="center" gap="space-4" wrap={false}>
                    <div>{header}</div>
                    {column.filter ? (
                      <DataGridFilterMenu
                        field={column.field}
                        filter={column.filter}
                        scope={scope}
                        onFilterChange={onFilterChange}
                      />
                    ) : null}
                  </HStack>
                </Table.HeaderCell>
              )
            }
          })}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.length === 0 && loading && <SkeletonRows columns={visibleColumns} expandable={expandable} />}
        {rows.length === 0 && !loading && (
          <PlaceholderRow colSpan={colSpan} textSize={textSize}>
            {emptyMessage}
          </PlaceholderRow>
        )}
        {rows.map((row) => {
          const key = keyFactory(row)

          const cells = visibleColumns.map((column) => {
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

          const rowClassName = clsx({
            [classes.highlighted]: typeof isHighlighted === 'function' && isHighlighted(row),
          })
          if (typeof renderContent === 'function') {
            return (
              <ExpandableRow key={key} className={rowClassName} renderContent={renderContent} row={row}>
                {cells}
              </ExpandableRow>
            )
          } else {
            return (
              <Table.Row key={key} className={rowClassName}>
                {cells}
              </Table.Row>
            )
          }
        })}
      </Table.Body>
      {pagination && (
        <tfoot>
          <Table.Row>
            <Table.DataCell colSpan={colSpan} textSize={textSize}>
              <Pagination page={pageNumber} count={20} size="xsmall" prevNextTexts />
            </Table.DataCell>
          </Table.Row>
        </tfoot>
      )}
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

const skeletonRows: number[] = Array.from({ length: 10 }, (_, index) => index)

function SkeletonRows<T extends object>({
  columns,
  expandable,
}: {
  columns: DataGridColumn<T>[]
  expandable: boolean
}) {
  const height = expandable ? '2rem' : undefined
  return skeletonRows.map((key) => (
    <Table.Row key={key}>
      {expandable ? (
        <Table.DataCell style={{ width: 48 }}>
          <Skeleton height={height} />
        </Table.DataCell>
      ) : null}
      {columns.map((column) => (
        <Table.DataCell key={column.field} width={column.width}>
          <Skeleton height={height} />
        </Table.DataCell>
      ))}
    </Table.Row>
  ))
}

export interface DataGridContentProps<T extends object> {
  row: T
}

function ExpandableRow<T extends object>({
  className,
  row,
  renderContent,
  children,
}: {
  className?: string
  row: T
  renderContent: NonNullable<DataGridProps<T>['renderContent']>
  children: ReactNode
}) {
  const [visible, setVisible] = useState(false)
  return (
    <Table.ExpandableRow
      className={className}
      open={visible}
      onOpenChange={setVisible}
      content={visible ? renderContent({ row }) : null}
    >
      {children}
    </Table.ExpandableRow>
  )
}
