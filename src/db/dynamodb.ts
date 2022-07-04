import { Todo } from "../model/todo.ts";
import { notUndefined } from "../util.ts";
import {
    unmarshall,
    marshall,
} from "https://esm.sh/@aws-sdk/util-dynamodb@3.121.0";
import {
    DeleteItemCommand,
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
    ScanCommand,
} from "https://esm.sh/@aws-sdk/client-dynamodb@3.121.0";
import { DB } from "./db.ts";

class DynamoDb<T> implements DB<T> {
    private readonly client;
    constructor(
        private readonly access_key_id: string,
        private readonly secret_access_key: string,
        private readonly tableName: string,
    ) {
        this.client = new DynamoDBClient({
            region: "us-east-1",
            credentials: {
                accessKeyId: this.access_key_id,
                secretAccessKey: this.secret_access_key,
            },
        });
    }

    private validateResponse(response: {
        $metadata: { httpStatusCode?: number };
    }) {
        if (response.$metadata.httpStatusCode !== 200) {
            throw "Expected http status code to be 200";
        }
    }

    public async list(): Promise<Record<string, T>> {
        console.debug("Started listing todos");
        const command = new ScanCommand({
            TableName: this.tableName,
        }); // TODO - paginate this
        const result = await this.client.send(command);
        this.validateResponse(result);
        const items = Object.fromEntries(
            notUndefined(result.Items)
                .map((item) => unmarshall(item))
                .map((item) => [item["id"], item]),
        );
        return items;
    }

    public async get(id: string): Promise<T | undefined> {
        const command = new GetItemCommand({
            TableName: this.tableName,
            Key: marshall({ id }),
        });
        const result = await this.client.send(command);
        this.validateResponse(result);
        const item = result.Item ? unmarshall(result.Item) : result.Item;
        return item as T;
    }

    public async insert(val: Omit<T, "id">): Promise<string> {
        const newId = crypto.randomUUID();
        const command = new PutItemCommand({
            TableName: this.tableName,
            Item: marshall({ id: newId, ...val }),
        });
        this.validateResponse(await this.client.send(command));
        return newId;
    }

    public async update(
        id: string,
        val: Partial<Omit<T, "id">>,
    ): Promise<void> {
        const existingItem = await this.get(id);
        if (existingItem) {
            const command = new PutItemCommand({
                TableName: this.tableName,
                Item: marshall({ ...existingItem, ...val, id }),
            });
            this.validateResponse(await this.client.send(command));
        } else {
            throw `Tried to update object with id ${id}, but it did not exist`;
        }
    }

    public async delete(id: string): Promise<void> {
        console.debug(`Starting to delete ${id}`);
        const existingItem = await this.get(id);
        if (existingItem) {
            const command = new DeleteItemCommand({
                TableName: this.tableName,
                Key: marshall({ id }),
            });
            const response = await this.client.send(command);
            this.validateResponse(response);
            console.debug(`Finished deleting ${id}`);
        } else {
            console.warn(
                `Tried to delete object with id ${id}, but it did not exist`,
            );
        }
    }
}

export const todoDb = new DynamoDb<Todo>(
    notUndefined(Deno.env.get("AWS_ACCESS_KEY_ID")),
    notUndefined(Deno.env.get("AWS_SECRET_ACCESS_KEY")),
    "to-talk-about",
);
