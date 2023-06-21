export type Json = {
  [key: string]: any
};

export type Typed = Json & {
  type?: string | undefined;
}