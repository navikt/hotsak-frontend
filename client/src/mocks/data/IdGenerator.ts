export class IdGenerator {
  constructor(private id: number = 0) {}

  nesteId(): number {
    return (this.id += 1)
  }
}
