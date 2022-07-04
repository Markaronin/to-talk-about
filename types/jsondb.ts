import { DB } from "./db.ts";
import { Todo } from "./todo.ts";

class JsonDB<T> implements DB<T> {
    constructor(private readonly filePath: string) {}

    private async save(currentItems: Record<string, T>): Promise<void> {
        await Deno.writeTextFile(this.filePath, JSON.stringify(currentItems));
    }

    public async get(id: string): Promise<T | undefined> {
        const currentItems = await this.list();
        return currentItems[id];
    }

    public async list(): Promise<Record<string, T>> {
        return await Deno.readTextFile(this.filePath).then(JSON.parse);
    }

    public async insert(item: T): Promise<string> {
        const myUUID = crypto.randomUUID();
        const currentItems = await this.list();
        currentItems[myUUID] = item;
        await this.save(currentItems);
        return myUUID;
    }

    public async update(id: string, val: T): Promise<void> {
        const currentItems = await this.list();
        if (id in currentItems) {
            currentItems[id] = val;
            await this.save(currentItems);
        } else {
            throw `Tried to update item ${id} that did not exist in the db`;
        }
    }

    public async delete(id: string): Promise<void> {
        const currentItems = await this.list();
        if (id in currentItems) {
            delete currentItems[id];
            await this.save(currentItems);
        } else {
            throw `Tried to delete item ${id} that did not exist in the db`;
        }
    }
}

export const todoDb = new JsonDB<Todo>("db.json");
