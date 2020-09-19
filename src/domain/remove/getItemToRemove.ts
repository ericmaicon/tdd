import { Document, Response } from '../protocol';

/**
 * this function will get the remove flag items and map it to a string type object
 *
 * @param originalSubDocument
 * @param subDocument
 * @param key
 */
export default function getItemChanges(
  originalSubDocument: Document[],
  subDocument: Document[],
  key: string,
): Response {
  return subDocument
    .filter((item: Document) => item._delete === true)
    .reduce((deleteResponse: Response, item: Document) => {
      const originalItem = originalSubDocument
        .find((tempItem: Document) => tempItem._id === item._id);

      const itemKey = originalSubDocument
        .findIndex((tempItem: Document) => tempItem._id === item._id);

      if (!originalItem) {
        return deleteResponse;
      }

      return Object.assign(deleteResponse, {
        [`${key}.${itemKey}`]: true,
      })
    }, {});
}
