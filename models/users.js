import mongoose from "mongoose";
import  {eventSchema}  from "./events.js";
import findOrCreate from "mongoose-findorcreate";
import passportLocalMongoose from "passport-local-mongoose";

export const userSchema = new mongoose.Schema({
    name:String,
    email: String,
    number:String,
    password: String,
    googleId: String,
    facebookId: String,
    events: [eventSchema],
  });

  userSchema.plugin(passportLocalMongoose);
  userSchema.plugin(findOrCreate);
  
  const User = new mongoose.model("User", userSchema);

export default User;


