import { Document, Response } from '../protocol';
import { getItemChanges } from '.';

/**
 * This function has the responsability to check if the item changed.
 *
 * @param originalDocument
 * @param mutation
 */
export default function checkUpdateItem(
  originalDocument: Document,
  mutation: Document,
):Response {
  return Object
    .keys(mutation)
    .filter((key: string) => Array.isArray(mutation[key]))
    .reduce((response: Response, key: string) => {
      // check in the document if the array item exists
      const originalSubDocument = originalDocument[key] as Document[];
      const subDocument = mutation[key] as Document[];

      // check the update ones (_id exists)
      const itemsUpdated = getItemChanges(originalSubDocument, subDocument, key);

      if (!itemsUpdated) {
        return response;
      }

      return Object.assign(response, itemsUpdated);
    }, {});
}
