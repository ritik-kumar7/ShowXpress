import { Inngest } from "inngest";
import User from "../models/UserModels.js";
// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

//ingest function to use data save of user

const syncUserCreateion = inngest.createFunction(
    { id: 'sync-user-creation-from-clerk' },
    { event: 'clerk.user.created' },
    async ({ event }) => {
        const { id, first_name, last_name, email, address, image_url } = event.data;
        const userData = {
            _id: id,
            email: email,
            name: first_name + " " + last_name,
            image: image_url
        }
        await User.create(userData);

    }
)


//ingest function to use data update of user
const syncUserUpdateion = inngest.createFunction(
    { id: 'sync-user-update-from-clerk' },
    { event: 'clerk.user.updated' },
    async ({ event }) => {
        const { id, first_name, last_name, email, address, image_url } = event.data;
        const userData = {
            _id: id,
            email: email,
            name: first_name + " " + last_name,
            image: image_url
        }
        await User.findByIdAndUpdate(id, userData);

    }
)


// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreateion, syncUserUpdateion];