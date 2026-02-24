const express = require("express");
const userAuth = require("../middleware/auth");
const router = express.Router();
const checkRole = require("../middleware/checkRole");
const Job = require("../models/job");
const Application = require("../models/application");

router.post(
  "/applications/:jobId",
  userAuth,
  checkRole("Candidate"),
  async (req, res) => {
    try {
      let jobId = req.params.jobId;
      let job = await Job.findById(jobId);

      if (!job) return res.status(404).json({ message: "Job not found" });

      let existing = await Application.findOne({
        jobId,
        candidateId: req.user._id
      });

      if(existing) return res.status(409).json({ message: "Already applied" });

      let startOfDay = new Date().setHours(0, 0, 0, 0)
      let endOfDay = new Date().setHours(23, 59, 59, 999)

      let applicationCount = await Application.countDocuments({
        candidateId: req.user._id,
        createdAt: {$gte: startOfDay, $lte: endOfDay}
      })

      if(applicationCount >= 10) return res.status(400).json({message: "You can apply only to 10 jobs per day"})

      let newApp = new Application({
        jobId,
        candidateId: req.user._id,
        status: "Applied",
      });
      let newApplication = await newApp.save();
      res
        .status(201)
        .json({
          message: "Application sent successfuly",
          data: newApplication,
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ERROR: err.message });
    }
  },
);

router.get("/applications/job/:jobId", userAuth, checkRole("Recruiter"), async (req, res) => {
    try{
        let jobId = req.params.jobId
        
        let job = await Job.findById(jobId)

        if(!job) return res.status(404).json({message: "Job not found"})

        if(!job.createdBy.equals(req.user._id)) return res.status(403).send("Access denied");

        let applications = await Application.find({jobId}).populate("candidateId", "firstName lastName emailId ")
        
        res.json({data: applications})
    }catch(err){
        console.error(err)
        res.status(500).json({ERROR: err.message})
    }
})

module.exports = router;
