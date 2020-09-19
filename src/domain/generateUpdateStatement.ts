export interface Document {
  [key: string]: Document[] | string | number;
}

interface Response {
  [key: string]: string;
}

function getDifference(orignalItem:Document, item:Document) {
  return Object
    .keys(orignalItem)
    .filter((key: string) => !Array.isArray(orignalItem[key]))
    .reduce((response: Response, key: string) => {
      if (orignalItem[key] !== item[key]) {
        return Object.assign(response, {
          [key]: item[key],
        });
      }

      return response;
    }, {});
}

/**
 * Update the originalDocument with a given mutation
 * object
 *
 * @param originalDocument
 * @param mutation
 */
export default function generateUpdateStatement(
  originalDocument: Document,
  mutation: Document,
) {
  const itemsToUpdate = Object
    .keys(mutation)
    .filter((key: string) => Array.isArray(mutation[key]))
    .reduce((response: Response, key: string) => {
      // check in the document if the array item exists
      const subDocument = mutation[key] as Document[];
      const originalSubDocument = originalDocument[key] as Document[];

      // check the update ones (_id exists)
      const itemsUpdated = subDocument
        .filter((item: Document) => item._id)
        .reduce((updateResponse: Response, item: Document, itemKey: number) => {
          const originalItem = originalSubDocument.find((tempItem: Document) => tempItem._id);
          if (!originalItem) {
            return updateResponse;
          }

          const difference = getDifference(originalItem, item);
          return Object.keys(difference).reduce((tempResponse:Response, differenceKey: string) => Object.assign(tempResponse, { [`${key}.${itemKey}.${differenceKey}`]: difference[differenceKey] }), {});
        }, {});

      if (!itemsUpdated) {
        return response;
      }

      return Object.assign(response, itemsUpdated);
    }, {});

  return {
    $update: itemsToUpdate,
  };
}
