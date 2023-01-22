import mongoose from "mongoose";
import { userSchema } from "./users.js";

export const eventSchema = new mongoose.Schema({
    userCreated: String,
    name: String,
    description: String,
    teamName: String,
    applyDate: String,
    eventDate: String,
    venue: String,
    eventWebsite: String,
    noOfUserRequired: Number,
    noOfUserIn: Number,
    usersRequested: [String],
    eventTeamComplete: Boolean,
  });

export default mongoose.model("Event", eventSchema);