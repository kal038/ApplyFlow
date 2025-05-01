import { docClient } from "@/lib/db";
import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { ReturnValue } from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";
import { LineJob } from "@/types";
dotenv.config();

// Define return types for DynamoDB responses
interface DynamoDBResponse {
  Item?: LineJob; //returned by a GetCommand
  Items?: LineJob[]; //returned by a QueryCommand and ScanCommand
  Attributes?: LineJob; //returned by an UpdateCommand or DeleteCommand
}

// getJobById(job_id)
export const getJobById = async (
  job_id: string
): Promise<LineJob | undefined> => {
  const params = {
    TableName: process.env.JOBS_TABLE || "ApplyFlow",
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
export const getJobsByUserId = async (user_id: string): Promise<LineJob[]> => {
  //define query params
  const params = {
    TableName: process.env.JOBS_TABLE || "ApplyFlow",
    IndexName: "user-id-index", // Assuming you have a GSI on user_id, which we do
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
    return data.Items as LineJob[];
  } catch (error) {
    console.error("Error getting jobs:", error);
    throw error;
  }
};

export const createJob = async (job: LineJob): Promise<DynamoDBResponse> => {
  const params = {
    TableName: process.env.JOBS_TABLE || "ApplyFlow",
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
    TableName: process.env.JOBS_TABLE || "ApplyFlow",
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
    TableName: process.env.JOBS_TABLE || "ApplyFlow",
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
