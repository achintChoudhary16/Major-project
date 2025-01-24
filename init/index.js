const mongoose=require("mongoose");
const initData=require("./data.js")
const Listing=require("../models/listing.js");
const dbs_URL='mongodb://127.0.0.1:27017/WonderLust';

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
console.log(err);
});

async function main(){
    await mongoose.connect(dbs_URL)
}


const initDB = async ()=>{
    await Listing.deleteMany({});
   initData.data= initData.data.map((obj)=>({...obj,owner:"678e1479f4fb1395ac4d8e0c"}));
    await Listing.insertMany(initData.data);
    console.log("data was inserted")
}

initDB();