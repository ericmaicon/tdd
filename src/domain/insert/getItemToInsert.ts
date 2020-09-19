import { Document } from '../protocol';

/**
 * this function will get the new items and map it to a string type object
 *
 * @param originalSubDocument
 * @param subDocument
 * @param key
 */
export default function getItemToInsert(
  subDocument: Document[],
  key: string,
): Document {
  return subDocument
    .filter((item: Document) => !item._id)
    .reduce((insertResponse: Document, item: Document) => Object.assign(insertResponse, {
      [key]: [item],
    }), {});
}
