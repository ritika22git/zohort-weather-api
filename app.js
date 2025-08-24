const express = require("express");
const weatherRoutes = require("./routes/weatherRoutes");

const app = express();

app.use(express.json());


app.use("/", weatherRoutes);


app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
