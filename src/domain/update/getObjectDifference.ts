import { Document, Response } from '../protocol';

/**
 * this function will return the difference between two documents
 *
 * @param orignalItem
 * @param item
 */
export default function getObjectDifference(orignalItem:Document, item:Document) {
  return Object
    .keys(orignalItem)
    .filter((key: string) => !Array.isArray(orignalItem[key]))
    .reduce((response: Response, key: string) => {
      if (orignalItem[key] === item[key]) {
        return response;
      }

      return Object.assign(response, {
        [key]: item[key],
      });
    }, {});
}
