import { http, app } from "./app";
import {con} from "./db";

app.get('/zoowee', function(req, res) {
  res.send("zoo wee back at ya")
});

http.listen(app.get("port"), () => {
  console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
  console.log("  Press CTRL-C to stop\n");
});
