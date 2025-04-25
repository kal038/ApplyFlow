import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { ReturnValue } from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";
import { LineJob } from "../types";

dotenv.config();
const TABLE_NAME = "ApplyFlowJobs";
const REGION = process.env.AWS_REGION || "us-east-1";
const ddbClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(ddbClient);

// Define return types for DynamoDB responses
interface DynamoDBResponse {
  Item?: LineJob;
  Items?: LineJob[];
  Attributes?: LineJob;
}

// getJobById(job_id)
export const getJobById = async (
  job_id: string
): Promise<LineJob | undefined> => {
  const params = {
    TableName: TABLE_NAME,
    Key: { job_id },
  };
  try {
    const data = await docClient.send(new GetCommand(params));
    return data.Item as LineJob | undefined;
  } catch (error) {
    console.error("Error getting job:", error);
    throw error;
  }
};

// getAllJobs(user_id)
export const getAllJobsUser = async (user_id: string): Promise<LineJob[]> => {
  //define query params
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "user_id = :user_id",
    ExpressionAttributeValues: {
      ":user_id": user_id,
    },
  };
  //form the query
  const query = new QueryCommand(params);

  //hit the db, error handling
  try {
    const data = await docClient.send(query);
    return (data.Items || []) as LineJob[];
  } catch (error) {
    console.error("Error getting jobs:", error);
    throw error;
  }
};

export const createJob = async (job: LineJob): Promise<DynamoDBResponse> => {
  const params = {
    TableName: TABLE_NAME,
    Item: job,
  };

  const createQuery = new PutCommand(params);

  try {
    const data = await docClient.send(createQuery);
    return data as DynamoDBResponse;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

export const updateJob = async (
  job_id: string,
  job: Partial<LineJob>
): Promise<DynamoDBResponse> => {
  // Create expression parts only for fields that exist in the update
  const updateFields: string[] = [];
  const expressionNames: Record<string, string> = {};
  const expressionValues: Record<string, unknown> = {};

  // Only include fields that are provided in the update
  Object.entries(job).forEach(([key, value]) => {
    if (value !== undefined) {
      updateFields.push(`#${key} = :${key}`);
      expressionNames[`#${key}`] = key;
      expressionValues[`:${key}`] = value;
    }
  });

  const params = {
    TableName: TABLE_NAME,
    Key: { job_id },
    UpdateExpression: `set ${updateFields.join(", ")}`,
    ExpressionAttributeNames: expressionNames,
    ExpressionAttributeValues: expressionValues,
    ReturnValues: ReturnValue.ALL_NEW,
    ConditionExpression: "attribute_exists(job_id)",
  };

  try {
    const data = await docClient.send(new UpdateCommand(params));
    return data as DynamoDBResponse;
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

export const deleteJob = async (job_id: string): Promise<DynamoDBResponse> => {
  const params = {
    TableName: TABLE_NAME,
    Key: { job_id },
    ReturnValues: ReturnValue.ALL_OLD,
  };

  const deleteQuery = new DeleteCommand(params);

  try {
    const data = await docClient.send(deleteQuery);
    return data as DynamoDBResponse;
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};
