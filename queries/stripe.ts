"use server";

import { db } from "../lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { PaymentIntent } from "@stripe/stripe-js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: "2024-11-20.acacia",
});

export const createStripePaymentIntent = async (orderId: string) => {
  try {
    // Get current user
    const user = await currentUser();

    // Ensure user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Fetch the order to get total price
    const order = await db.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error("Order not found.");

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    throw error;
  }
};

export const createStripePayment = async (
  orderId: string,
  paymentIntent: PaymentIntent
) => {
  try {
    // Get current user
    const user = await currentUser();

    // Ensure user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Fetch the order to get total price
    const order = await db.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error("Order not found.");

    // Create payment details record
    // Note: PaymentDetails schema has: transactionId, paymentMethod, paymentStatus, totalPaid
    const newPaymentDetails = await db.paymentDetails.create({
      data: {
        transactionId: paymentIntent.id,
        paymentMethod: "Stripe",
        totalPaid: paymentIntent.amount / 100, // Convert cents back to dollars
        paymentStatus:
          paymentIntent.status === "succeeded" ? "paid" : "unpaid",
        userId: user.id,
      },
    });

    // Update the order with payment details
    // Note: Order schema doesn't have paymentMethod field
    const updatedOrder = await db.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentStatus: paymentIntent.status === "succeeded" ? "Paid" : "Failed",
        paymentDetailsId: newPaymentDetails.id,
      },
      include: {
        paymentDetails: true,
      },
    });

    return updatedOrder;
  } catch (error) {
    throw error;
  }
};