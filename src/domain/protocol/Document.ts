export default interface Document {
  [key: string]: Document[] | string | number;
}
