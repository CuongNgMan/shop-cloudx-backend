export interface IRepository<T> {
  create(input: Partial<T>): Promise<T>;

  list(): Promise<T[]>;

  getById<T>(id: string): Promise<T>;
}
