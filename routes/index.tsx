/** @jsx h */
import { Handlers, PageProps } from "https://deno.land/x/fresh@1.0.0/server.ts";
import { Head } from "https://deno.land/x/fresh@1.0.0/src/runtime/head.ts";
import { Fragment, h } from "preact";
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
        <Fragment>
            <Head>
                <title>To Talk About</title>
                <link rel="stylesheet/less" href="style.less" />
                <script src="https://cdn.jsdelivr.net/npm/less@4"></script>
            </Head>
            <div>
                <h1>To Talk About</h1>
                {Object.entries(data)
                    .sort((a, b) => a[1].title.localeCompare(b[1].title))
                    .map(([id, todo]) => (
                        <div className="todo-row">
                            <form
                                method="post"
                                action="api/todo"
                                style={{ display: "flex" }}
                            >
                                <input type="hidden" name="deleting" />
                                <input type="hidden" name="id" value={id} />
                                {todo.title}
                                <button style={{ marginLeft: "auto" }}>
                                    Delete
                                </button>
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
        </Fragment>
    );
}
