import { unmarshall } from '@aws-sdk/util-dynamodb'

export const parseEventDynamoDB = (data: any | undefined) => {
  if (!data) {
    return null
  }
  return unmarshall(data)
}
