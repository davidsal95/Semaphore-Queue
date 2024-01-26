// Importing the sendTrackingEvent function from the 'tracker' module.
import { sendTrackingEvent } from './tracker';

// Definition of the EventQueue class.
class EventQueue {
    // Static instance to implement the Singleton pattern.
    private static instance: EventQueue;

    // Queue to store functions representing events.
    private queue: (() => Promise<void>)[] = [];

    // Flag to indicate whether the queue is currently being processed.
    private isProcessing = false;

    // Maximum number of retries for processing an event.
    private maxRetries = 3;

    // Delay (in milliseconds) between retry attempts.
    private retryDelay = 3000; // 3 seconds

    // Private constructor to prevent direct instantiation.
    private constructor() {}

    // Static method to get the singleton instance of EventQueue.
    static getInstance(): EventQueue {
        if (!EventQueue.instance) {
            EventQueue.instance = new EventQueue();
        }
        return EventQueue.instance;
    }

    // Method to enqueue an event for processing.
    enqueueEvent(eventFn: () => Promise<void>): void {
        this.queue.push(eventFn);
        this.processQueue(); // Initiates processing of the queue.
    }

    // Private method to process the event queue.
    private async processQueue(): Promise<void> {
        // If the queue is already being processed, exit.
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true; // Set the processing flag.

        // Continue processing events while the queue is not empty.
        while (this.queue.length > 0) {
            const currentEvent = this.queue[0]; // Get the first event in the queue.
            let retries = 0; // Initialize retry counter.

            // Attempt to process the current event with retries.
            while (retries <= this.maxRetries) {
                try {
                    await currentEvent(); // Execute the event function.
                    break; // If successful, exit the retry loop.
                } catch (error) {
                    // Log error and retry if retries remain.
                    console.error(`Error processing event: ${error}`);
                    retries++;

                    if (retries <= this.maxRetries) {
                        console.log(
                            `Retrying in ${this.retryDelay / 1000} seconds...`
                        );
                        await new Promise((resolve) =>
                            setTimeout(resolve, this.retryDelay)
                        );
                    }
                }
            }

            this.queue.shift(); // Remove the processed event from the queue.
        }

        this.isProcessing = false; // Reset the processing flag.
    }
}

// Function to emit a tracking event by adding it to the event queue.
export const emitTrackingEvent = (eventId: number) => {
    console.log(`Event ${eventId} Emitted`);

    // Define an asynchronous function representing the tracking event.
    const eventFn = async () => {
        await sendTrackingEvent(eventId);
    };

    // Enqueue the event for processing.
    EventQueue.getInstance().enqueueEvent(eventFn);
};

// Function to emit five tracking events in sequence.
const sendFiveTrackingEvents = async () => {
    for (let i = 1; i <= 5; i++) {
        emitTrackingEvent(i);
    }
};

// Function to emit tracking events, including a call to sendFiveTrackingEvents.
export const emitTrackingEventsQueue = () => {
    sendFiveTrackingEvents(); // Enqueue five tracking events.
    emitTrackingEvent(6); // You can uncomment this line to add an additional event.
};
