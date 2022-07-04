/** @jsx h */
import { Handlers, PageProps } from "https://deno.land/x/fresh@1.0.0/server.ts";
import { h } from "preact";
import { todoDb } from "../src/db/dynamodb.ts";
import { Todo } from "../src/model/todo.ts";

export const handler: Handlers<Record<string, Todo>> = {
    async GET(_, ctx) {
        const todos = await todoDb.list();
        return ctx.render(todos);
    },
};

export default function Home({ data }: PageProps<Record<string, Todo>>) {
    return (
        <div>
            <h1>Todos</h1>
            <ul>
                {Object.entries(data).map(([id, todo]) => (
                    <li>
                        <form method="post" action="api/todo">
                            <input type="hidden" name="deleting" />
                            <input type="hidden" name="id" value={id} />
                            {todo.title}
                            <button>Delete</button>
                        </form>
                    </li>
                ))}
            </ul>
            <hr />
            <form method="post" action="api/todo">
                Add new TODO:
                <br />
                <label>
                    Title:
                    <input name="title" />
                </label>
                <br />
                <button>Add</button>
            </form>
            <hr />
        </div>
    );
}
