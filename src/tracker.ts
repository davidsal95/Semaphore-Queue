export const sendTrackingEvent = async (eventId: number) => {
    if (eventId === 5 && Math.random() < 0.5) {
        throw new Error(`Network Error Event ${eventId}`);
    }

    const randomWaitTime = Math.floor(Math.random() * 2);
    await new Promise((resolve) => setTimeout(resolve, randomWaitTime * 1000));
    console.log(`Event: ${eventId} Reached Server`);
};
