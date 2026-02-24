const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const Job = require("../models/job");
const User = require("../models/user");
const {validateEditData} = require("../utils/helpers")

router.use(cookieParser());
router.use(bodyParser.json());

router.post("/jobs", userAuth, checkRole("Recruiter"), async (req, res) => {
  try {
    let user = await User.findById(req.body.createdBy);
    if (!user) throw new Error("User not present");

    let newJob = new Job(req.body);
    let data = await newJob.save();
    res.status(201).json({ status: "Job created", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ERROR: err.message });
  }
});

router.get("/jobs", userAuth, async (req, res) => {
  try {
    let limit = req.query.limit;
    let page = req.query.page;
    let skip = (page - 1) * limit;

    let jobs = await Job.find({}).skip(skip).limit(limit);
    res.json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ERROR: err.message });
  }
});

router.get("/jobs/:id", userAuth, async (req, res) => {
  try {
    let jobId = req.params.id;
    let job = await Job.findById(jobId);
    res.send(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ERROR: err.message });
  }
});

router.patch("/jobs/:id", userAuth, checkRole("Recruiter"), async (req, res) => {
    try {
        
       let isEditAllowed = validateEditData(req)
       if(!isEditAllowed) throw new Error("Cannot edit the given fields")

      let jobId = req.params.id;
      let job = await Job.findById(jobId);

      if (!job.createdBy.equals(req.user._id))
        throw new Error("You are not allowed to take this action");

      let editFields = Object.keys(req.body)
      
      editFields.forEach(editField => {
        job[editField] = req.body[editField]
      })
      
      let data = await job.save()
      res.json({message: "Job updated successfuly", data})

    } catch (err) {
      console.error(err);
      res.status(500).json({ ERROR: err.message });
    }
  },
);

router.delete("/jobs/:id", userAuth, checkRole("Recruiter"), async(req, res) => {
    try{
        let jobId = req.params.id

        let job = await Job.findById(jobId);
        if (!job.createdBy.equals(req.user._id))
        throw new Error("You are not allowed to take this action");

        let deletedJob = await Job.deleteOne({_id: jobId})
        res.json({message: "Job deleted successfuly", data: deletedJob})

    }catch(err){
        console.error(err)
        res.status(500).json({ERROR: err.message})
    }
})

module.exports = router;
