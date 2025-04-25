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

dotenv.config();
const TABLE_NAME = "ApplyFlowJobs";
const REGION = process.env.AWS_REGION || "us-east-1";
const ddbClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(ddbClient);

// getJobById(job_id)
// send GetCommand with TableName + Key { job_id }
// return Item
export const getJobById = async (job_id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { job_id },
  };
  try {
    const data = await docClient.send(new GetCommand(params));
    return data.Item;
  } catch (error) {
    console.error("Error getting job:", error);
    throw error;
  }
};

// getAllJobs(user_id)
// send QueryCommand with TableName + KeyConditionExpression + ExpressionAttributeValues
// return Items

export const getAllJobsUser = async (user_id) => {
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
    return data.Items;
  } catch (error) {
    console.error("Error getting jobs:", error);
    throw error;
  }
};

export const createJob = async (job) => {
  const params = {
    TableName: TABLE_NAME,
    Item: job,
  };

  const createQuery = new PutCommand(params);

  try {
    const data = await docClient.send(createQuery);
    return data;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

export const updateJob = async (job_id, job) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { job_id },
    UpdateExpression:
      "set #user_id = :user_id, #company = :company, #title = :title, #status = :status, #applied_date = :applied_date, #notes = :notes",
    ExpressionAttributeNames: {
      "#user_id": "user_id",
      "#company": "company",
      "#title": "title",
      "#status": "status",
      "#applied_date": "applied_date",
      "#notes": "notes",
    },
    ExpressionAttributeValues: {
      ":user_id": job.user_id,
      ":company": job.company,
      ":title": job.title,
      ":status": job.status,
      ":applied_date": job.applied_date,
      ":notes": job.notes,
    },
    ReturnValues: "ALL_NEW",
    ConditionExpression: "attribute_exists(job_id)",
  };

  const updateQuery = new UpdateCommand(params);

  try {
    const data = await docClient.send(updateQuery);
    return data;
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

export const deleteJob = async (job_id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { job_id },
  };

  const deleteQuery = new DeleteCommand(params);

  try {
    const data = await docClient.send(deleteQuery);
    return data;
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};
