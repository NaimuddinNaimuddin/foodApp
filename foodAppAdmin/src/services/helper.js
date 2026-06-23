/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price of the product
 * @param {number} discountedPrice - Discounted/selling price
 * @returns {number} Discount percentage (rounded)
 */
export const calculateDP = (originalPrice, discountedPrice) => {
    if (!originalPrice || originalPrice <= 0) return 0;

    const discount =
        ((originalPrice - discountedPrice) / originalPrice) * 100;

    return `${Math.round(discount)}% OFF`;
};
