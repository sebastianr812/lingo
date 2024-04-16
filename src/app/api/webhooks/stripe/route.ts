import db from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        );
    } catch (e: any) {
        // Status code is IMPORTANT for stripe webhooks, this is how
        // Stripe knows something went wrong with the webhook request
        return new NextResponse(`Webhook error: ${e.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    // payment was completed, we can create a new subscription record
    // in DB
    if (event.type === "checkout.session.completed") {

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        if (!session?.metadata?.userId) {
           return new NextResponse("user id is required", { status: 400 });
        }

        await db.insert(userSubscription).values({
            stripeSubscriptionId: subscription.id,
            userId: session.metadata.userId,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
        });
    }

    // user is renewing the subscription, update the period end in DB
    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        await db.update(userSubscription).set({
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        }).where(eq(userSubscription.stripeSubscriptionId, subscription.id));
    }

    return new NextResponse(null, { status: 200 });

}

