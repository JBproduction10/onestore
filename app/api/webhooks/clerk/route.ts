import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { User } from "@prisma/client";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // When user is created or updated
  if (evt.type === "user.created" || evt.type === "user.updated") {
    try {
      // Parse the incoming event data
      const data = JSON.parse(body).data;

      // Validate required fields
      if (!data.id || !data.email_addresses || data.email_addresses.length === 0) {
        console.error("Missing required user data:", data);
        return new Response("Invalid user data", { status: 400 });
      }

      const email = data.email_addresses[0].email_address;
      const userId = data.id;
      const name = `${data.first_name || ""} ${data.last_name || ""}`.trim() || "User";
      const picture = data.image_url || "";

      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { id: userId },
      });

      let dbUser;

      if (existingUser) {
        // Update existing user
        dbUser = await db.user.update({
          where: { id: userId },
          data: {
            name,
            email,
            picture,
          },
        });
      } else {
        // Create new user
        dbUser = await db.user.create({
          data: {
            id: userId,
            name,
            email,
            picture,
            role: "USER", // Default role
          },
        });
      }

      // Update user's metadata in Clerk with the role information
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        privateMetadata: {
          role: dbUser.role || "USER",
        },
      });

      console.log(`User ${evt.type === "user.created" ? "created" : "updated"} successfully:`, userId);
    } catch (error) {
      console.error("Error processing user webhook:", error);
      return new Response("Error processing user data", { status: 500 });
    }
  }

  // When user is deleted
  if (evt.type === "user.deleted") {
    try {
      // Parse the incoming event data to get the user ID
      const userId = JSON.parse(body).data.id;

      if (!userId) {
        console.error("Missing user ID for deletion");
        return new Response("Invalid user ID", { status: 400 });
      }

      // Delete the user from the database based on the user ID
      await db.user.delete({
        where: {
          id: userId,
        },
      });

      console.log("User deleted successfully:", userId);
    } catch (error) {
      console.error("Error deleting user:", error);
      // If user doesn't exist, that's okay
      if ((error)) {
        return new Response("Error deleting user", { status: 500 });
      }
    }
  }

  return new Response("", { status: 200 });
}