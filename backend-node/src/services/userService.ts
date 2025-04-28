import { docClient } from "@/lib/db";
import { User } from "@/types";
import { QueryCommand, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { hash } from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

/*
 * user_id is PK, email is GSI
 * can only use GetCommand for PK, have to use QueryCommand for GSI
 * functions resolves to undefined if no mathing item is found
 * if the item is found, it resolves to the item
 */

interface DynamoDBResponse {
  Item?: User;
  Items?: User[];
  Attributes?: User;
}

export const findUserByEmail = async (
  email: string
): Promise<User | undefined> => {
  const params = {
    TableName: process.env.USERS_TABLE,
    IndexName: "email-index",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  };
  const { Items } = await docClient.send(new QueryCommand(params));
  return Items?.[0] as User;
};

export const findUserById = async (
  user_id: string
): Promise<User | undefined> => {
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      user_id,
    },
  };
  const { Item } = await docClient.send(new GetCommand(params));
  return Item as User;
};

export const createUser = async (
  email: string,
  password: string
): Promise<User> => {
  const user_id = uuidv4();
  const password_hash = await hash(password, 10);
  const created_at = new Date().toISOString();
  const new_user: User = {
    user_id,
    email,
    password_hash,
    created_at,
  };
  const params = { TableName: process.env.USERS_TABLE, Item: new_user };
  await docClient.send(new PutCommand(params));
  return new_user;
};
