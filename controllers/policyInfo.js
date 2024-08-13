import { User, PolicyInfo,Message } from "../models/index.js";
import schedule from 'node-schedule'

export const findPolicyInfoByFirstName = async (req, res) => {
  const { firstname } = req.query;

  if (!firstname) {
    return res.status(400).json({ error: "First name is required" });
  }

  try {
    const users = await User.find({ firstname: firstname });

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found with the given first name" });
    }
    const userIds = users.map((user) => user._id);

    const policies = await PolicyInfo.find({ user: { $in: userIds } })
      .populate({
        path: "policyCategory",
      })
      .populate({
        path: "policyCarrier",
      })
      .populate({
        path: "user",
      });

    if (policies.length === 0) {
      return res
        .status(404)
        .json({ message: "No policies found for the given first name" });
    }

    return res.status(200).json(policies);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error in searching for policies" });
  }
};

export const getAggregatedPoliciesByUser = async (req, res) => {
  try {
    const policiesByUser = await PolicyInfo.aggregate([
      {
        $lookup: {
          from: "users", 
          localField: "user",
          foreignField: "_id", 
          as: "userDetails", 
        },
      },
      {
        $unwind: "$userDetails", 
      },
      {
        $group: {
          _id: "$userDetails._id", 
          user: {
            $first: {
              _id: "$userDetails._id",
              firstname: "$userDetails.firstname",
              email: "$userDetails.email",
            },
          },
          policies: {
            $push: {
              policy_number: "$policy_number",
              policy_start_date: "$policy_start_date",
              policy_end_date: "$policy_end_date",
              policyCategory: "$policyCategory",
              policyCarrier: "$policyCarrier",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
            },
          },
          policyCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          user: 1,
          policyCount: 1, 
          policies: 1,
        },
      },
    ]);

    return res.status(200).json(policiesByUser);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error in aggregating policies by user" });
  }
};

export const scheduleMessage = (req, res) => {
  const { message, day, time } = req.body;
  const [hour, minute] = time.split(':').map(Number);
  
  // Construct the target date object
  const targetDate = new Date(`${day}T${time}:00`);

  console.log('Target Date:', targetDate);
  
  // Check if the target date is in the future
  if (targetDate < new Date()) {
    return res.status(400).json({ message: 'Time must be in the future' });
  }

  // Schedule the job using node-schedule
  schedule.scheduleJob(targetDate, async () => {
    try {
      // Create and save the message
      const savedMessage = new Message({ message });
      await savedMessage.save();
      console.log('Saved Message:', savedMessage);
    } catch (error) {
      console.error('Error inserting message:', error);
    }
  });

  res.json({ message: 'Message scheduled successfully!' });
};