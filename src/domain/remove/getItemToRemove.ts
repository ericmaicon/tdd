import hasChildArray from '../hasChildArray';
import { Document, Response } from '../protocol';
import checkRemoveItem from './checkRemoveItem';

/**
 * this function will get the remove flag items and map it to a string type object
 *
 * @param originalSubDocument
 * @param subDocument
 * @param key
 */
export default function getItemToRemove(
  originalSubDocument: Document[],
  subDocument: Document[],
  key: string,
): Response {
  return subDocument
    .reduce((deleteResponse: Response, item: Document) => {
      const originalItem = originalSubDocument
        .find((tempItem: Document) => tempItem._id === item._id);

      const itemKey = originalSubDocument
        .findIndex((tempItem: Document) => tempItem._id === item._id);

      if (!originalItem) {
        return deleteResponse;
      }

      if (hasChildArray(item)) {
        const childrenResponse = checkRemoveItem(originalItem, item);

        return Object
          .keys(childrenResponse)
          .reduce((tempResponse: Response, childKey: string) => Object.assign(tempResponse, {
            [`${key}.${itemKey}.${childKey}`]: true,
          }), {});
      }

      if (!item._delete) {
        return deleteResponse;
      }

      return Object.assign(deleteResponse, {
        [`${key}.${itemKey}`]: true,
      })
    }, {});
}
