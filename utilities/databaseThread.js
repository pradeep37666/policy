
import { parentPort } from "worker_threads";

 
import mongoose from "mongoose";
import { Agent,PolicyCarrier,PolicyCategory,PolicyInfo,User,UserAccount } from "../models/index.js";


export const createPolicyWithBulkOperations = async (dataArray) => {
    
  const bulkOps = [];
  const agentMap = {};
  const userMap = {};
  const accountMap = {};
  const policyCategoryMap = {};
  const policyCarrierMap = {};

  for (const data of dataArray) {
    if (!agentMap[data.agent]) {
      agentMap[data.agent] = new Agent({ name: data.agent });
      bulkOps.push({ insertOne: { document: agentMap[data.agent] } });
    }

    if (!userMap[data.email]) {
      userMap[data.email] = new User({
        firstname: data.firstname,
        dob: data.dob,
        address: data.address,
        phone: data.phone,
        state: data.state,
        zip: data.zip,
        email: data.email,
        gender: data.gender,
        userType: data.userType,
      });
      bulkOps.push({ insertOne: { document: userMap[data.email] } });
    }

    if (!accountMap[data.account_name]) {
      accountMap[data.account_name] = new UserAccount({ account_name: data.account_name });
      bulkOps.push({ insertOne: { document: accountMap[data.account_name] } });
    }

    if (!policyCategoryMap[data.category_name]) {
      policyCategoryMap[data.category_name] = new PolicyCategory({
        category_name: data.category_name,
      });
      bulkOps.push({ insertOne: { document: policyCategoryMap[data.category_name] } });
    }

    if (!policyCarrierMap[data.company_name]) {
      policyCarrierMap[data.company_name] = new PolicyCarrier({
        company_name: data.company_name,
      });
      bulkOps.push({ insertOne: { document: policyCarrierMap[data.company_name] } });
    }
  }

 // Perform bulk write operations in parallel
 const agentPromise = Agent.bulkWrite(bulkOps.filter(op => op.insertOne && op.insertOne.document instanceof Agent));
 const userAccountPromise = UserAccount.bulkWrite(bulkOps.filter(op => op.insertOne && op.insertOne.document instanceof UserAccount));
 const policyCategoryPromise = PolicyCategory.bulkWrite(bulkOps.filter(op => op.insertOne && op.insertOne.document instanceof PolicyCategory));
 const policyCarrierPromise = PolicyCarrier.bulkWrite(bulkOps.filter(op => op.insertOne && op.insertOne.document instanceof PolicyCarrier));
 const userPromise = User.bulkWrite(bulkOps.filter(op => op.insertOne && op.insertOne.document instanceof User));

 // Prepare and insert PolicyInfo documents
 const policyInfo = dataArray.map(data => new PolicyInfo({
   policy_number: data.policy_number,
   policy_start_date: data.policy_start_date,
   policy_end_date: data.policy_end_date,
   policyCategory: policyCategoryMap[data.category_name]._id,
   policyCarrier: policyCarrierMap[data.company_name]._id,
   user: userMap[data.email]._id,
 }));
 const policyInfoPromise = PolicyInfo.insertMany(policyInfo);

 // Execute all promises in parallel
 await Promise.all([
   agentPromise,
   userAccountPromise,
   policyCategoryPromise,
   policyCarrierPromise,
   userPromise,
   policyInfoPromise
 ]);
};

parentPort.on('message', async (data) => {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect('mongodb://localhost:27017/policy');
    }
    await createPolicyWithBulkOperations(JSON.parse(data));
    parentPort.postMessage({status:true , message :'Data saved successfully.'});
    mongoose.disconnect()
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  }
});
