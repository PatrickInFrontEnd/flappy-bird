const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", true);
    app.use((req, res, next) => {
        if (req.secure || req.headers["x-forwarded-proto"] === "https") return next();
        res.redirect(301, `https://${req.headers.host}${req.url}`);
    });
}

app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, (e) => {
    if (e) throw e;
    console.log(`Server running on port ${port}.`);
    if (process.env.NODE_ENV !== "production") {
        console.log(`Visit your site: http://localhost:${port}`);
    }
});
