export type Json = {
  [key: string]: any
};

export interface Parsable<T, U extends T> {
  fromJson (object: T, ...args: any[]): Promise<U> | U;
  toJson (): Promise<T> | T;
}