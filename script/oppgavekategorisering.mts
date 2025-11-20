#!/usr/bin/env bun

async function main() {
  const file = Bun.file('../client/src/mocks/data/isokategorisering.json')
  const json: Record<string, any>[] = await file.json()
  const entries = Map.groupBy(json, (it) => it.iso_kategori_kode)
    .entries()
    .map(([key, value]) => [key, value[0]])
  console.log(JSON.stringify(Object.fromEntries(entries), null, 2))
}

main().catch(console.error)
