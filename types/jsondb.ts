import { Todo } from "./todo.ts";

class JsonDB<T> {
    constructor(private readonly filePath: string) {}

    public async list(): Promise<T[]> {
        return await Deno.readTextFile(this.filePath).then(JSON.parse);
    }

    public async insert(item: T): Promise<void> {
        const currentItems = await this.list();
        currentItems.push(item);
        await Deno.writeTextFile(this.filePath, JSON.stringify(currentItems));
    }
}

export const todoDb = new JsonDB<Todo>("db.json");
