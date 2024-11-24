# lo-mapping-solution

## Overview

The `mapping.js` script provides a mapping function, `map`, to transform complex input data structures into a unified and standardized output schema. This is particularly useful for scenarios involving data normalization, preparation for further processing, or integration with downstream systems.

## Features

- **Main Functionality:**  
  - The `map` function is the core of this script. It processes the input object (`skynet`) and generates a structured result object.
- **Modular Sub-functions:**  
  - Modular mapping functions (e.g., `mapPersonal`, `mapAddress`, `mapIncome`, etc.) handle specific sub-segments of the input data.
- **Extensive Data Transformation:**  
  - Includes mappings for personal details, address, business information, income, expenses, assets, liabilities, and compliance details.
- **Error Handling:**  
  - Includes validation for essential fields, e.g., checking if `skynet.borrower` is an array.

## Usage

### Prerequisites

- Ensure your environment is set up with a JavaScript runtime such as Node.js.
- The input data must adhere to the expected schema for `skynet`.

### Example

```javascript
const input = {
  borrower: [
    {
      personal: { firstName: "John", lastName: "Doe" },
      address: [{ unitNumber: 12, street: "Main St", country: "USA" }],
      employment: [{ employer: "Tech Inc", yearsEmployed: 2 }],
      income: { payslipNetIncome: 5000 },
      expenses: { expenses: [{ name: "GROCERIES", value: 200 }] },
      assetsLiabilities: { assets: [{ name: "Car", value: 15000 }] },
      creditInfo: { creditHistory: "Good" },
    },
  ],
  business: { entityType: "Company", tradingName: "Tech Solutions" },
  loanDetails: { lender: "Bank A", loanAmount: 20000 },
};

const result = map(input);
console.log(result);
```

### Output

The `map` function will output an object structured as follows:

```json
{
  "mainApplicant": {
    "personal": { "firstName": "John", "lastName": "Doe" },
    "address": { "currentAddress": {...}, ... },
    "employment": [...],
    "income": {...},
    "expense": {...},
    "assetsLiabilities": {...},
    "creditInfo": {...}
  },
  "financeDetails": {...},
  "business": {...},
  "loanDetails": {...},
  ...
}
```

## Functions

### Main Function
- **`map(skynet)`**  
  - Takes the input data (`skynet`) and outputs a normalized result.

### Supporting Functions
- **Personal Data Mapping:** `mapPersonal`  
- **Address Handling:** `mapAddress`  
- **Business Info Mapping:** `mapBusiness`  
- **Income and Expenses:** `mapIncome`, `mapExpense`  
- **Assets and Liabilities:** `mapAssetsLiabilities`  
- **Compliance Data:** `mapCompliance`  
- **Utility Functions:**  
  - `toYesNo`, `toTitledString`, `toNum`, `formatAddress`, etc.

## Functions Requiring Further Mapping

The following functions have comments labeled `// map needed`. These require additional manual implementation to define their behavior:

- **`mapIndustry(title)`**
- **`mapAddressStatus(title)`**
- **`mapRentType(title)`**
- **`beneficiaryType(value)`**
- **`mapTitle(title)`**
- **`mapGender(value)`**
- **`mapMaritalStatus(value)`**
- **`mapCitizenship(value)`**
- **`mapVisaType(value)`**
- **`mapDriverLicenceClass(value)`**
- **`mapAssetType(value)`**
- **`mapLibType(value)`**
- **`mapLender(value)`**
- **`mapNetIncomeVerification(value)`**

These functions need specific transformation logic to meet the application's requirements.

## Fields Needing Clarification

The following **24 fields** are marked with `// issue` comments in the script. These require further clarification or detailed implementation:

1. `result.assetVisibility` (defaulted to `"Yes"`)
2. `result.totalMonthlyIncome` (placeholder for calculated value)
3. `result.totalMonthlyExpense` (placeholder for calculated value)
4. `result.lenderAverageHEM` (placeholder for calculated value)
5. `result.netSurplus` (placeholder for calculated value)
6. `lenderApplicationNumber` in `mapLoanDetails` (marked as an issue)
7. `isItYourCurrentAddress` in address mappings (logic review needed)
8. Placeholder for `netSurplusIncludingRepayment` in `mapLoanDetails`
9. Placeholder for `netAmountFinanced` in `mapLoanDetails`
10. `otherPurpose` in `mapFinanceDetails` (defaulted to `"string"`)
11. Placeholder for `trusteeType` in `mapBusiness`
12. `vendorType` in `mapVendorDetails` (not mapped)
13. `vendorBsb` in `mapVendorDetails` (not mapped)
14. `vendorAccountNumber` in `mapVendorDetails` (not mapped)
15. `vendorAccountName` in `mapVendorDetails` (not mapped)
16. `vendor_Bank` in `mapVendorDetails` (not mapped)
17. `payoutBsb` in `mapVendorDetails` (not mapped)
18. `payoutAccountNumber` in `mapVendorDetails` (not mapped)
19. `payoutAccountName` in `mapVendorDetails` (not mapped)
20. `payout_Bank` in `mapVendorDetails` (not mapped)
21. `interestType` in `mapLoanDetails` (defaulted to `"string"`)
22. Placeholder for `otherFee` logic in `mapLoanDetails`
23. Placeholder for `description` in `mapCompliance`
24. Placeholder for `foreseeableChangesExplanation` in `mapExpense`