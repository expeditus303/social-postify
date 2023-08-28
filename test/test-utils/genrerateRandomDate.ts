export function generateRandomFutureDate(maxDaysInFuture: number) {
    const randomFutureDate = new Date();
    const randomDays = Math.floor(Math.random() * (maxDaysInFuture - 2)) + 2; 
    randomFutureDate.setDate(randomFutureDate.getDate() + randomDays);
    return randomFutureDate.toISOString();
}
