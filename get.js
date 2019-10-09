import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

// This follows exactly the same structure as our previous create.js function.
// The major difference here is that we are doing a
// dynamoDbLib.call('get', params) to get a note object given the noteId
// and userId that is passed in through the request.

export async function main(event, context) {
  const params = {
    TableName: "notes",
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    }
  };

  try {
    const result = await dynamoDbLib.call("get", params);
    if (result.Item){
      //return retrieved Item
      return success(result.Item);
    } else {
      return failure({status: false, error: "item not found."});
    }
  } catch (e){
    return failure({ status: false });
  }
}
