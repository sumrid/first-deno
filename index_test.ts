import { assert } from "https://deno.land/std/testing/asserts.ts";
import { TextProtoReader } from "https://deno.land/std/textproto/mod.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";

Deno.test({
  name: "GET success",
  fn: async () => {
    // Start server
    let server = Deno.run(
      {
        cmd: [Deno.execPath(), "run", "--allow-net", "index.ts"],
        stdout: "piped",
      },
    );

    assert(server.stdout != null);
    try {
      const reader = new TextProtoReader(new BufReader(server.stdout));
      const str = await reader.readLine();
      assert(str?.includes("server run on port: 8080"));

      // Connect and request to server.
      const conn = await Deno.connect({ port: 8080 });
      await conn.write(new TextEncoder().encode("GET / HTTP/1.0\n\n"));

      const res = new Uint8Array(100);
      await conn.read(res); // อ่านข้อมูลใส่ตัวแปร res
      conn.close();

      const resStr = new TextDecoder().decode(res.buffer); // buffer to string

      assert(resStr.includes("Hello world from Deno"));
      assert(resStr.includes("200"));
    } finally {
      server.close();
      server.stdout?.close();
    }
  },
});
