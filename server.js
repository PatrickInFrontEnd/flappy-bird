const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const path = require("path");
const enforce = require("express-sslify");

const app = express();

const port = process.env.PORT || 8000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

if (process.env.NODE_ENV === "production") {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.production.html"));
});

app.listen(port, (e) => {
    if (e) throw e;
    console.log(`Server running on port ${port}.`);
    if (process.env.NODE_ENV !== "production") {
        console.log(`Visit your site: http://localhost:${port}`);
    }
});
