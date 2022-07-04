import { Todo } from "./todo.ts";
import { notUndefined } from "./util.ts";
import {
    unmarshall,
    marshall,
} from "https://esm.sh/@aws-sdk/util-dynamodb@3.121.0";
import {
    DeleteItemCommand,
    DynamoDBClient,
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
        throw "Not implemented";
        return undefined;
    }

    public async insert(val: T): Promise<string> {
        const newId = crypto.randomUUID();
        const command = new PutItemCommand({
            TableName: this.tableName,
            Item: marshall({ id: newId, ...val }),
        });
        this.validateResponse(await this.client.send(command));
        return newId;
    }

    public async update(id: string, val: T): Promise<void> {
        throw "Not implemented";
    }

    public async delete(id: string): Promise<void> {
        const command = new DeleteItemCommand({
            TableName: this.tableName,
            Key: marshall({ id }),
        });
        this.validateResponse(await this.client.send(command));
    }
}

export const todoDb = new DynamoDb<Todo>(
    notUndefined(Deno.env.get("AWS_ACCESS_KEY_ID")),
    notUndefined(Deno.env.get("AWS_SECRET_ACCESS_KEY")),
    "to-talk-about",
);
