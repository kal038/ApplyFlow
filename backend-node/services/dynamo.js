import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import dotenv from "dotenv";
// load env vars (dotenv)
dotenv.config();

// TABLE_NAME constant = 'ApplyFlowJobs'
const TABLE_NAME = "ApplyFlowJobs";
const REGION = process.env.AWS_REGION || "us-east-1";
const ddbClient = new DynamoDBClient({ region: REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

// getJobById(job_id)
// send GetCommand with TableName + Key { job_id }
// return Item
export const getJobById = async (job_id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { job_id },
  };
  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    return data.Item;
  } catch (error) {
    console.error("Error getting job:", error);
    throw error;
  }
};

// getJobsByUserId(user_id)
// send QueryCommand
// use IndexName = 'user_id-index'
// KeyConditionExpression = 'user_id = :uid'
// ExpressionAttributeValues = { ':uid': user_id }

// createJob(jobData)
// send PutCommand with TableName + Item

// updateJob(job_id, updates)
// (optional) build UpdateExpression from updates
// send UpdateCommand with Key and updates

// deleteJob(job_id)
// send DeleteCommand with Key { job_id }
