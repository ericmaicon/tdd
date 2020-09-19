import hasChildArray from '../hasChildArray';
import { Document } from '../protocol';
import checkInsertItem from './checkInsertItem';

/**
 * this function will get the new items and map it to a string type object
 *
 * @param originalSubDocument
 * @param subDocument
 * @param key
 */
export default function getItemToInsert(
  originalSubDocument: Document[],
  subDocument: Document[],
  key: string,
): Document {
  return subDocument
    .reduce((insertResponse: Document, item: Document) => {
      if (hasChildArray(item)) {
        const originalItem = originalSubDocument
          .find((tempItem: Document) => tempItem._id === item._id);

        const itemKey = originalSubDocument
          .findIndex((tempItem: Document) => tempItem._id === item._id);

        if (!originalItem) {
          return insertResponse;
        }

        const childrenResponse = checkInsertItem(originalItem, item);

        return Object
          .keys(childrenResponse)
          .reduce((tempResponse: Document, childKey: string) => Object.assign(tempResponse, {
            [`${key}.${itemKey}.${childKey}`]: childrenResponse[childKey],
          }), insertResponse);
      }

      if (item._id) {
        return insertResponse;
      }

      let tempItem = [item];
      if (Array.isArray(insertResponse[key])) {
        tempItem = (insertResponse[key] as Document[]).concat(item);
      }

      return Object.assign(insertResponse, {
        [key]: tempItem,
      })
    }, {});
}
