type AnyJson = boolean | number | string | null | JsonArray | JsonMap;
interface JsonMap {
  [key: string]: AnyJson;
}
interface JsonArray extends Array<AnyJson> {}

interface JSON {
  parse(
    text: string,
    reviver?: ((this: any, key: string, value: any) => any) | undefined
  ): AnyJson;
}
