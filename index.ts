import { serve } from "https://deno.land/std/http/server.ts";

const PORT = 8080;
const server = serve(`0.0.0.0:${PORT}`);

console.log(`server run on port: ${PORT}`);
for await (const req of server) {
  console.log(req.url);
  req.respond(
    { body: JSON.stringify({ message: "Hello world from Deno", status: 200 }) },
  );
}
