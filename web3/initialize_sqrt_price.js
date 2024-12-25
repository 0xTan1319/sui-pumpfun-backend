function calculateSqrtPrice(amountA, amountB) {
    // Calculate the price ratio P = amountA / amountB
    const priceRatio = amountA / amountB;

    // Calculate the square root of the price ratio
    const sqrtPrice = Math.sqrt(priceRatio);

    // Multiply by 2^64 to get the fixed-point representation
    const TWO_POW_64 = BigInt("18446744073709551616"); // 2^64
    const sqrtPriceFixedPoint = BigInt(Math.round(sqrtPrice * Math.pow(2, 64)));  // Convert to BigInt after rounding

    return sqrtPriceFixedPoint;
}

// Example usage:
const amountA = 10;  // 10 USDC
const amountB = 1;   // 1 SUI

// Calculate the square root price
const sqrtPrice = calculateSqrtPrice(amountA, amountB);

// Output the result
console.log("Price Ratio (P):", amountA / amountB);  // Display the price ratio
console.log("Initialize sqrt price:", sqrtPrice.toString());  // Display the calculated sqrt price
