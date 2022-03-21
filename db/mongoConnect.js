const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://ma-stfs-bep1-db:PWD4stfsbep1mdb@cluster0.vixgd.mongodb.net/spft-bep1');
  console.log("mongo connected!!!");
}
