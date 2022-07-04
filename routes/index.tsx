/** @jsx h */
import { Handlers, PageProps } from "https://deno.land/x/fresh@1.0.0/server.ts";
import { h } from "preact";
import { todoDb } from "../types/jsondb.ts";
import { Todo } from "../types/todo.ts";

export const handler: Handlers<Todo[]> = {
    async GET(_, ctx) {
        const todos = await todoDb.list();
        return ctx.render(todos);
    },
};

export default function Home({ data }: PageProps<Todo[]>) {
    return (
        <div>
            <img
                src="/logo.svg"
                height="100px"
                alt="the fresh logo: a sliced lemon dripping with juice"
            />
            <hr />
            <h1>Todos</h1>
            <ul>
                {data.map((todo) => (
                    <li>
                        <form method="post" action="api/todo">
                            <input type="hidden" name="deleting" />
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
