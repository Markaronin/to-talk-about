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
            {Object.entries(data).map(([id, todo]) => (
                <div
                    style={{
                        marginTop: "0.25em",
                        paddingTop: "0.25em",
                        borderTop: "1px solid black",
                    }}
                >
                    <form
                        method="post"
                        action="api/todo"
                        style={{ display: "flex" }}
                    >
                        <input type="hidden" name="deleting" />
                        <input type="hidden" name="id" value={id} />
                        {todo.title}
                        <button style={{ marginLeft: "auto" }}>Delete</button>
                    </form>
                </div>
            ))}
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
