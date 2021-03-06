import hasChildArray from '../hasChildArray';
import { Document, Response } from '../protocol';
import { checkUpdateItem, getObjectDifference } from '.';

/**
 * this function will get the changes and map it to a string type object
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
    .filter((item: Document) => item._id)
    .filter((item: Document) => !item._delete)
    .reduce((updateResponse: Response, item: Document) => {
      const originalItem = originalSubDocument
        .find((tempItem: Document) => tempItem._id === item._id);

      const itemKey = originalSubDocument
        .findIndex((tempItem: Document) => tempItem._id === item._id);

      if (!originalItem) {
        return updateResponse;
      }

      const difference = getObjectDifference(originalItem, item);
      const parentResponse = Object
        .keys(difference)
        .filter((differenceKey: string) => difference[differenceKey])
        .reduce((tempResponse:Response, differenceKey: string) => Object.assign(tempResponse, {
          [`${key}.${itemKey}.${differenceKey}`]: difference[differenceKey],
        }), updateResponse);

      if (hasChildArray(item)) {
        const childrenResponse = checkUpdateItem(originalItem, item);
        return Object
          .keys(childrenResponse)
          .reduce((tempResponse: Response, childKey: string) => Object.assign(tempResponse, {
            [`${key}.${itemKey}.${childKey}`]: childrenResponse[childKey],
          }), parentResponse);
      }

      return parentResponse;
    }, {});
}
