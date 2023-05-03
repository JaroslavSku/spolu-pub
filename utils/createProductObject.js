function createProductObject(name, amount) {
  const beforeTaxPrice = amount ? (amount / 1.21).toFixed(1) : 0;

  return [
    {
      name: name,
      priceBeforeTax: beforeTaxPrice,
      qty: 1,
      tax: 21,
      priceAfterTax: amount,
    },
  ];
}

module.exports = createProductObject;
