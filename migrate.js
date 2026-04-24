const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/texellence-express-v2';

mongoose.connect(MONGODB_URI).then(async () => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const hasAdvance = collections.some(c => c.name === 'labouradvances');
    
    if (hasAdvance) {
      const advanceData = await db.collection('labouradvances').find().toArray();
      if (advanceData.length > 0) {
        console.log(`Migrating ${advanceData.length} records from 'labouradvances' into 'salaries'...`);
        for (let adv of advanceData) {
          // Find existing salary record
          const salary = await db.collection('salaries').findOne({ name: adv.labour_name });
          if (salary) {
             await db.collection('salaries').updateOne(
               { _id: salary._id },
               { $inc: { advance_given: adv.advance_taken } }
             );
          } else {
             await db.collection('salaries').insertOne({
               name: adv.labour_name,
               role: 'Helper', // default
               shift: 'Day',
               monthly_salary: 15000,
               advance_given: adv.advance_taken,
               net_amount: 15000 - adv.advance_taken,
               date: new Date().toISOString().split('T')[0],
               createdAt: new Date(),
               updatedAt: new Date()
             });
          }
        }
      }
      await db.dropCollection('labouradvances');
      console.log("Migration complete. Removed 'labouradvances' collection.");
    } else {
      console.log("No legacy 'labouradvances' collection found. No migration needed.");
    }
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    mongoose.disconnect();
  }
});
