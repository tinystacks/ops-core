export type Json = {
  [key: string]: any
};

export type Typed = Json & {
  type?: string | undefined;
}

export interface Parsable<T extends Typed, U extends T> {
  fromJson (object: T, ...args: any[]): Promise<U> | U;
  toJson (): Promise<T> | T;
}