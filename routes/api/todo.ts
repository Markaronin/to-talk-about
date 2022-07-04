import { Handlers } from "$fresh/server.ts";
import { Todo } from "types/todo.ts";
import { todoDb } from "../../types/jsondb.ts";
import { notNull } from "../../types/util.ts";

function add(req: Request, formData: FormData): Response {
    const newTodo: Todo = {
        title: formData.get("title")!.toString(),
    };
    todoDb.insert(newTodo);
    return Response.redirect(notNull(req.headers.get("referer")));
}
function del(req: Request, formData: FormData): Response {
    console.log("deleting", formData);
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
