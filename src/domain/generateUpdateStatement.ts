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

function hasChildArray(item: Document) {
  return Object
    .keys(item)
    .reduce((exists:boolean, key:string) => {
      if (exists) {
        return exists;
      }

      return Array.isArray(item[key]);
    }, false);
}

function checkChangedItems(
  originalSubDocument: Document[],
  subDocument: Document[],
  key: string,
): Response {
  return subDocument
    .filter((item: Document) => item._id)
    .reduce((updateResponse: Response, item: Document) => {
      const originalItem = originalSubDocument
        .find((tempItem: Document) => tempItem._id === item._id);
      const itemKey = originalSubDocument
        .findIndex((tempItem: Document) => tempItem._id === item._id);

      if (!originalItem) {
        return updateResponse;
      }

      if (hasChildArray(item)) {
        const childrenResponse = recursiveCheckDocumentItems(originalItem, item);
        return Object
          .keys(childrenResponse)
          .reduce((tempResponse: Response, childKey: string) => Object.assign(tempResponse, {
            [`${key}.${itemKey}.${childKey}`]: childrenResponse[childKey],
          }),
          {});
      }

      const difference = getDifference(originalItem, item);
      return Object
        .keys(difference)
        .reduce((tempResponse:Response, differenceKey: string) => Object.assign(tempResponse, {
          [`${key}.${itemKey}.${differenceKey}`]: difference[differenceKey],
        }), {});
    }, {});
}

function recursiveCheckDocumentItems(
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
      const itemsUpdated = checkChangedItems(originalSubDocument, subDocument, key);

      if (!itemsUpdated) {
        return response;
      }

      return Object.assign(response, itemsUpdated);
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
  const itemsToUpdate = recursiveCheckDocumentItems(originalDocument, mutation);

  return {
    $update: itemsToUpdate,
  };
}
