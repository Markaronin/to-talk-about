import { Handlers } from "$fresh/server.ts";
import { Todo } from "../../src/model/todo.ts";
import { todoDb } from "../../src/db/dynamodb.ts";
import { notNull } from "../../src/util.ts";

async function add(req: Request, formData: FormData): Promise<Response> {
    const newTodo: Omit<Todo, "id"> = {
        title: notNull(formData.get("title")).toString(),
    };
    await todoDb.insert(newTodo);
    return Response.redirect(notNull(req.headers.get("referer")));
}
async function del(req: Request, formData: FormData): Promise<Response> {
    await todoDb.delete(notNull(formData.get("id")).toString());
    return Response.redirect(notNull(req.headers.get("referer")));
}

export const handler: Handlers = {
    async POST(req, _ctx) {
        const formData = await req.formData();
        if (formData.has("deleting")) {
            return del(req, formData);
        } else {
            return add(req, formData);
        }
    },
};
