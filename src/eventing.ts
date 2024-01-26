// Importing the sendTrackingEvent function from the 'tracker' module.
import { sendTrackingEvent } from './tracker';

// Maximum number of retries for emitting a tracking event.
const maxRetries = 3;

// Delay (in milliseconds) between retry attempts.
const retryDelay = 3000; // 3 seconds

// Asynchronous function to emit a tracking event with retry logic.
export const emitTrackingEvent = async (eventId: number) => {
    let retries = 0; // Initialize retry counter.

    // Continue retrying until maxRetries is reached.
    while (retries <= maxRetries) {
        try {
            console.log(`Event ${eventId} Emitted`);
            await sendTrackingEvent(eventId); // Attempt to emit the tracking event.
            break; // If successful, exit the retry loop.
        } catch (error) {
            // Log error and retry if retries remain.
            console.error(`Error emitting event ${eventId}: ${error}`);
            retries++;

            if (retries <= maxRetries) {
                console.log(`Retrying in ${retryDelay / 1000} seconds...`);
                // Delay before the next retry attempt.
                await new Promise((resolve) => setTimeout(resolve, retryDelay));
            }
        }
    }
};

// Asynchronous function to emit five tracking events in sequence.
const sendFiveTrackingEvents = async () => {
    for (let i = 1; i <= 5; i++) {
        // Uncomment the line below if you want to wait for each emitTrackingEvent to complete before the next iteration.
        await emitTrackingEvent(i);
        // emitTrackingEvent(i); // Emit each tracking event.
    }
};

// Function to emit tracking events, including a call to sendFiveTrackingEvents.
export const emitTrackingEvents = () => {
    sendFiveTrackingEvents(); // Enqueue five tracking events.
    // Uncomment the line below to add an additional tracking event.
    emitTrackingEvent(6);
};
