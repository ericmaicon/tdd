import { Document, Response } from '../protocol';
import { getItemToInsert } from '.';

/**
 * This function has the responsability to check if the item is new.
 *
 * @param originalDocument
 * @param mutation
 */
export default function checkInsertItem(
  mutation: Document,
):Response {
  return Object
    .keys(mutation)
    .filter((key: string) => Array.isArray(mutation[key]))
    .reduce((response: Response, key: string) => {
      const subDocument = mutation[key] as Document[];
      const itemsInserted = getItemToInsert(subDocument, key);

      if (!itemsInserted) {
        return response;
      }

      return Object.assign(response, itemsInserted);
    }, {});
}
