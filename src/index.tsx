import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { usersTable } from "../db/schema";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

/*****************************************
 * get users
 *****************************************/
app.get("/users", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(usersTable).all();
  return c.json(result);
});

/*****************************************
 * create users
 *****************************************/
app.post("/users", async (c) => {
  const params = await c.req.json<typeof usersTable.$inferSelect>();
  const db = drizzle(c.env.DB);

  const result = await db.insert(usersTable).values({
    name: params.name,
    email: params.email,
    age: params.age,
  });

  return c.json(result);
});

export default app;