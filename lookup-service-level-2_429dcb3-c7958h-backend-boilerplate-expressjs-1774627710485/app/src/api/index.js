const express = require("express");
const router = express.Router();
const { getCreditDataCached, saveToCache } = require("./database")
const { getCreditDetails } = require("./creditService")

router.get("/ping", (req, res) => {
  res.status(200).send({
    result: "pong"
  })
})

router.get("/credit-data/:ssn", async (req, res) => { 
  const ssn = req.params.ssn;
  
  try {
    const cached = await getCreditDataCached(ssn);
    
    if (cached) {
      console.log("Credit data is cached");
      return res.status(200).json(cached);
    }

    const aggregatedResults = await getCreditDetails(ssn);

    if (!aggregatedResults) {
      return res.status(404).send("Credit data not found for given ssn");
    }

    await saveToCache(ssn, aggregatedResults);

    res.status(200).json(aggregatedResults);

  } catch (error) {
    console.error("Error:", error);
    
    if (error.statusCode) {
      return res.status(error.statusCode).send(error.message);
    }

    res.status(500).send("Internal error");
  }
});

module.exports = router;
