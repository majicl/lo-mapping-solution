/* eslint-disable no-undef */

function map(skynet) {
  const result = {};
  if (Array.isArray(skynet.borrower)) {
    skynet.borrower.forEach((b, i) => {
      let target = {
        personal: mapPersonal(b.personal),
        address: mapAddress(b.address),
        emplyment: mapEmployment(b.employment),
        income: mapIncome(b.income),
        expense: mapExpense(b.expenses),
        assetsLiabilities: mapAssetsLiabilities(b.assetsLiabilities),
        creditInfo: mapCreditInfo(b.creditInfo),
      };
      if (i === 0) {
        result["mainApplicant"] = target;
      } else {
        result[`coApplicant${i}`] = target;
      }
    });
  } else {
    console.error("skynet.borrower is invalid");
  }

  result["financeDetails"] = mapFinanceDetails(skynet); //done
  result["business"] = mapBusiness(skynet); // done
  result["compliance"] = mapCompliance(skynet); // done
  result["assetDetails"] = mapAssetDetails(skynet); //done
  result["vendorDetails"] = mapVendorDetails(skynet); // half
  result["loanDetails"] = mapLoanDetails(skynet); // mostly done
  result["revenueDetails"] = mapRevenueDetails(skynet); // done

  result.expenseVisibility = toYesNo(skynet.borrower[0].income.showExpense);

  result.assetVisibility = "Yes"; // issue
  // result.totalMonthlyIncome = ''; // calculated;
  // result.totalMonthlyExpense = ''; // calculated;
  // result.lenderAverageHEM = ''; // calculated;
  // result.netSurplus = ''; // calculated;

  return result;
}

function mapCompliance(skynet) {
  const { requirementsAndObjectives, loanDetails } = skynet;
  return {
    monthlyBudget: requirementsAndObjectives.budgetedRepayments,
    amountToBorrow: requirementsAndObjectives.amountToBorrow,
    term: toNum(requirementsAndObjectives.term),
    balloonType:
      requirementsAndObjectives.balloonResidual > 100 ? "Amount" : "Percentage",
    balloonPercentage:
      requirementsAndObjectives.balloonResidual < 100
        ? requirementsAndObjectives.balloonResidual
        : 0,
    balloonAmount:
      requirementsAndObjectives.balloonResidual > 100
        ? requirementsAndObjectives.balloonResidual
        : 0,
    payEarly: toTitledString(requirementsAndObjectives.payEarly),
    description: requirementsAndObjectives.description,
    complianceNotes: loanDetails.complianceNotes,
    brokerSupportNotes: loanDetails.lenderNotes,
  };
}

function mapBusiness(skynet) {
  const business = skynet.business;
  return {
    entityType: mapEntityType(business.entityType),
    tradingName: business.tradingName,
    registration: {
      resgitrationNumber: business.aclABN,
      employerName: business.aclBusinessName,
    },
    gstRegistered: toTitledString(business.isGSTRegistered),
    dateEstablishment: business.dateEstablished,
    industry: mapIndustry(clean(business.industry)),
    dateRegisteredForGst: business.dateGSTRegistered,
    isCompanyProprietary: toTitledString(business.isCompanyProprietary),
    noOfGuarantors: business.noOfDirectors || "",
    noOfDirectors: business.noOfDirectors || "",
    noOfPartners: business.noOfDirectors || "",
    address: (business.address || []).map((current, i) => ({
      address: {
        formatted_address: formatAddress(current),
        id: current._id,
        address: {
          unit: current.address.unitNumber,
          streetNo: current.address.streetNumber,
          suburb: current.address.suburb,
          postalCode: current.address.postcode,
          state: current.address.state,
          country: current.address.country,
        },
      },
      addressStatus: mapAddressStatus(current.residentType),
      textField: current.residentTypeOther,
      rentType: mapRentType(current.rentType),
      rentorName:
        current.residentType === "RENTING" ? current.rentalAgencyName : "",
      rentorPhoneNumber:
        current.residentType === "RENTING" ? current.rentalAgencyPhone : "",
      landlordName:
        current.residentType === "BOARDING" ? current.rentalAgencyName : "",
      landlordPhoneNumber:
        current.residentType === "BOARDING" ? current.rentalAgencyPhone : "",
      timeAtYears: toNum(current.yearsAtAddress),
      timeAtMonths: toNum(current.monthsAtAddress),
      othetAddressType: toTitledString(current.residentType),
      isItYourCurrentAddress: i === 0 ? "Yes" : "No", // issue
    })),
    trust: {
      beneficiaryType: beneficiaryType(clean(business.beneficiaryType)),
      beneficiary: (business.beneficiary || []).map((b) => ({
        contactName: b.name,
        phoneNo: b.phone,
        businessName: b.businessName,
      })),
      trustee: {
        registration: {
          resgitrationNumber: skynet.trustee?.abn || skynet.trustee?.acn,
          employerName: skynet.trustee?.legalName,
        },
        trusteeType: mapEntityType(skynet.business?.trustType),
        tradingName: skynet.trustee?.tradingName,
        industry: skynet.trustee?.industry,
        dateEstablished: skynet.trustee?.dateGSTRegistered,
        gstRegistered: toTitledString(skynet.trustee?.isGSTRegistered),
        dateRegisteredForGst: skynet.trustee?.dateGSTRegistered,
        isCompanyProprietary: toTitledString(
          skynet.trustee?.isCompanyProprietary
        ),
        sameAsTrustAddress: toTitledString(skynet.trustee?.sameAddressAsTrust),
        address: (skynet.trustee?.address || []).map((current, i) => ({
          address: {
            formatted_address: formatAddress(current),
            id: current._id,
            address: {
              unit: current.address.unitNumber,
              streetNo: current.address.streetNumber,
              suburb: current.address.suburb,
              postalCode: current.address.postcode,
              state: current.address.state,
              country: current.address.country,
            },
          },
          addressStatus: mapAddressStatus(current.residentType),
          textField: current.residentTypeOther,
          rentType: mapRentType(current.rentType),
          rentorName:
            current.residentType === "RENTING" ? current.rentalAgencyName : "",
          rentorPhoneNumber:
            current.residentType === "RENTING" ? current.rentalAgencyPhone : "",
          landlordName:
            current.residentType === "BOARDING" ? current.rentalAgencyName : "",
          landlordPhoneNumber:
            current.residentType === "BOARDING"
              ? current.rentalAgencyPhone
              : "",
          timeAtYears: toNum(current.yearsAtAddress),
          timeAtMonths: toNum(current.monthsAtAddress),
          othetAddressType: toTitledString(current.residentType),
          isItYourCurrentAddress: i === 0 ? "Yes" : "No", // issue
        })),
      },
    },
  };
}

function mapRevenueDetails(skynet) {
  const { loanDetails } = skynet;
  return {
    originationFee: toNum(loanDetails.origination),
    financeCommission: toNum(loanDetails.brokerage),
    vbi: toNum(loanDetails.vbi),
    insuranceCommission: toNum(loanDetails.insurance),
    mmp: toNum(loanDetails.mppCommissionIncGST),
    warrantyCommission: toNum(loanDetails.warrantyCommission),
    clippedCommission: toNum(loanDetails.clippedCommission),
    gardx: toNum(loanDetails.gardxCommission),
    // totalIncome: 0, // calculated
    referrerPayment: toNum(loanDetails.referrerPayment),
  };
}

function mapLoanDetails(skynet) {
  const { loanDetails } = skynet;
  const equifaxCreditSearchFee = toNum(loanDetails.equifaxCreditSearchFee);
  const ppsrFee = toNum(loanDetails.ppsr);
  const lenderEstablishmentFee = toNum(loanDetails.lenderEstablishmentFee);
  const riskFee = toNum(loanDetails.riskFee);
  const otherFee = toNum(loanDetails.otherFees);
  const stampDuty = toNum(loanDetails.stampDuty);
  const fees = [];
  if (equifaxCreditSearchFee > 0) {
    fees.push("Equifax/Credit search fee");
  }
  if (ppsrFee > 0) {
    fees.push("PPSR");
  }
  if (lenderEstablishmentFee > 0) {
    fees.push("Lender Establishment fee");
  }
  if (riskFee > 0) {
    fees.push("Risk Fee");
  }
  if (otherFee > 0) {
    fees.push("Other");
  }
  if (stampDuty > 0) {
    fees.push("Stamp Duty");
  }
  return {
    lender: mapLender(clean(loanDetails.lender)),
    // interestType: '', // issue
    // interestRate: 0, // issue
    lenderApplicationNumber: loanDetails.lenderAppReference || "", // issue
    purchaseAmount: toNum(loanDetails.loanAmount),
    deposit: toNum(loanDetails.deposit),
    tradein: toNum(loanDetails.tradein),
    payout: toNum(loanDetails.payout),
    term: toNum(loanDetails.term),
    balloonType: toNum(loanDetails.balloonAmount) > 0 ? "Amount" : "Percentage",
    balloonAmount: toNum(loanDetails.balloonAmount),
    balloonPercentage: toNum(loanDetails.loanDetailsballoonPercentage),
    fees,
    equifaxCreditSearchFee,
    ppsrFee,
    lenderEstablishmentFee,
    riskFee,
    otherFee,
    stampDuty,
    monthlyRepayment: toNum(loanDetails.monthlyRepayment),
    // netSurplusIncludingRepayment: 0, // calculated
    // netAmountFinanced: 0, // calculated
  };
}

function mapVendorDetails(skynet) {
  const { dealershipDetails } = skynet;
  return {
    //vendorType: 'string', // issue
    dealership: {
      //   resgitrationNumber: '', // issue
      //   employerName: '', // issue
    },
    contactName: dealershipDetails.dealership,
    email: dealershipDetails.email,
    phone: dealershipDetails.phone,
    // vendorBsb: 0, // issue
    // vendorAccountNumber: 0, // issue
    // vendorAccountName: 'string', // issue
    // vendor_Bank: 'string', // issue
    // payoutBsb: 0, // issue
    // payoutAccountNumber: 0, // issue
    // payoutAccountName: 'string', // issue
    // payout_Bank: 'string', // issue
  };
}

function mapAssetDetails(skynet) {
  const assetDetails = skynet.assetDetails;
  return {
    id: "",
    vehicle: {
      make: assetDetails.make || "",
      model: assetDetails.model || "",
      year: toNum(assetDetails.year),
      estimatedValue: toNum(assetDetails.glassValuation),
      nvic: assetDetails.NVIC || "",
      vin: assetDetails.vic || "",
      state: assetDetails.registrationState || "",
      regNo: assetDetails.registration || "",
      variant: assetDetails.variant || "",
      series: assetDetails.series || "",
      modelDetails: assetDetails.description || "",
      saleType: mapSaleType(clean(assetDetails.saleType)),
      assetCondition: mapAssetCondition(clean(assetDetails.condition)),
      actualKm: assetDetails.actualKms || "",
    },
  };
}

function mapFinanceDetails(skynet) {
  const assetDetails = skynet.assetDetails;
  const loanUse = !assetDetails.loanUsage
    ? ""
    : assetDetails.loanUsage === "PERSONAL"
    ? "Consumer"
    : "Commercial";
  return {
    loanUse,
    assetCategory: mapAssetCategory(clean(assetDetails.assetCategory)),
    otherPurpose: "string",
    assetType: [mapAssetType(clean(assetDetails.assetType))],
    loanType: mapLoanType(clean(assetDetails.financeType)),
    amountRequired: skynet.loanDetails.totalAmount,
    applicationType:
      loanUse === "Consumer"
        ? mapApplicationType(clean(skynet.applicationType))
        : "",
  };
}

function mapCreditInfo(creditInfo) {
  return {
    creditHistory: mapCreditHistory(creditInfo.creditHistory),
    commitmentsUptodate: creditInfo.commitmentsUptodate,
    nonUptodateCommitmentsComment: creditInfo.nonUptodateCommitmentsComment,
    defaultAmount: toNum(creditInfo.defaultAmount),
    unpaidDefaultAmount: toNum(creditInfo.unpaidDefaultAmount),
    defaultAmountIssuedParty: creditInfo.defaultAmountIssuedParty,
    unpaidDefaultAmountIssuedParty: creditInfo.unpaidDefaultAmountIssuedParty,
    defaultAmountPaidDate: creditInfo.defaultAmountPaidDate,
    unpaidDefaultAmountIssuedDate: creditInfo.unpaidDefaultAmountIssuedDate,
    comprehensiveScore: toNum(creditInfo.comprehensiveScore),
    onePointOneScore: toNum(creditInfo.onePointOneScore),
    oneScore: toNum(creditInfo.oneScore),
    negativeScore: toNum(creditInfo.negativeScore),
    illionScore: toNum(creditInfo.illionScore),
    zignsec: toNum(creditInfo.zignsec),
  };
}

function mapPersonal(personal) {
  const noOfDependants = personal.noOfDependants
    ? parseInt(personal.noOfDependants)
    : 0;
  return {
    title: mapTitle(personal.title),
    otherTitle: personal.title || "",
    firstName: personal.firstName || "",
    lastName: personal.lastName || "",
    haveMiddleNames: toYesNo(personal.middleName, "No"),
    middleNames: personal.middleName || "",
    gender: mapGender(personal.gender),
    email: personal.email || "",
    phone: personal.mobilePhone || "",
    dateOfBirth: personal.dob || "",
    maritalStatus: mapMaritalStatus(personal.maritalStatus),
    anyDependants: toYesNo(noOfDependants > 0),
    howManyDependants: noOfDependants,
    dependents: new Array(noOfDependants).fill({}).map((_, i) => ({
      name: "",
      age: toNum(personal.ageOfDependants.split(",")[i]),
    })),
    citizenship: mapCitizenship(clean(personal.residencyStatus)),
    visaType: mapVisaType(clean(personal.visaType)),
    identificationType: mapIdentityType(personal.idType),
    drivingLicenceNumber: personal.driverLicenceNumber || "",
    driverlicenceed: personal.driverLicenceExpiry || "",
    driverLicenceClass: mapDriverLicenceClass(personal.driverLicenceType),
    driverLicenceIssuingState: personal.driverLicenceState,
    cardNumber: personal.driverLicenceCardNumber || "",
    visaExpiryDate: personal.visaExpiryDate || "",
    medicareNumber: personal.medicareCardNumber || "",
    medicarePosition: personal.medicareCardReferenceNumber
      ? parseInt(personal.medicareCardReferenceNumber)
      : 0,
    medicareExpiryDate: personal.medicareCardExpiry || "",
    photoIdCardNumber: personal.photoIdNumber || "",
    photoIdExpiryDate: personal.photoIdExpiry || "",
    photoIdIssuingState: personal.photoIdState || "",
    identificationNumber: personal.passportNumber || "",
    identificationExpiryDate: personal.passportExpiry || "",
    identificationIssuedBy: mapCountry(personal.passportCountry),
  };
}

function formatAddress(address) {
  const { unitNumber, streetNumber, street, suburb, state, postcode, country } =
    address;

  const unit = unitNumber ? `Unit ${unitNumber}, ` : "";
  const streetAddress =
    streetNumber && street ? `${streetNumber} ${street}` : street || "";
  const cityStatePostcode = [suburb, state, postcode]
    .filter(Boolean)
    .join(", ");
  const fullAddress =
    `${unit}${streetAddress}, ${cityStatePostcode}, ${country}`.replace(
      /, ,|, $/,
      ""
    );

  return fullAddress;
}

function mapAddress(address) {
  if (!Array.isArray(address) || address.length === 0) {
    return {};
  }

  const current = address[0];
  let previousAddress = address.length > 1 ? address[1] : {};

  return {
    currentAddress: {
      formatted_address: formatAddress(current),
      id: current._id || "",
      address: {
        unit: current.address?.unitNumber || "",
        streetNo: current.address?.streetNumber || "",
        suburb: current.address?.suburb || "",
        postalCode: current.address?.postcode || "",
        state: current.address?.state || "",
        country: current.address?.country || "",
      },
    },
    addressStatus: mapAddressStatus(current.residentType),
    textField: current.residentTypeOther || "",
    rentType: mapRentType(current.rentType),
    rentorName:
      current.residentType === "RENTING" ? current.rentalAgencyName : "",
    rentorPhoneNumber:
      current.residentType === "RENTING" ? current.rentalAgencyPhone : "",
    landlordName:
      current.residentType === "BOARDING" ? current.rentalAgencyName : "",
    landlordPhoneNumber:
      current.residentType === "BOARDING" ? current.rentalAgencyPhone : "",
    timeAtYears: toNum(current.yearsAtAddress),
    timeAtMonths: toNum(current.monthsAtAddress),
    previousAddress: {
      formatted_address: formatAddress(previousAddress),
      id: current._id,
      address: {
        unit: previousAddress.address?.unitNumber || "",
        streetNo: previousAddress.address?.streetNumber || "",
        suburb: previousAddress.address?.suburb || "",
        postalCode: previousAddress.address?.postcode || "",
        state: previousAddress.address?.state || "",
        country: previousAddress.address?.country || "",
      },
    },
    previousAddressStatus: mapAddressStatus(previousAddress.residentType),
    previousTimeAtYears: toNum(previousAddress.yearsAtAddress),
    previousTimeAtMonths: toNum(previousAddress.monthsAtAddress),
  };
}

function mapEmployment(employment) {
  if (!Array.isArray(employment)) return [];
  return employment.map((emp) => {
    return {
      employed__basis: mapEmploymentStatus(clean(emp.employmentStatus)),
      employed__occupation: mapOccupation(clean(emp.occupation)),
      employed__contactPerson: emp.employerContact || "",
      employed__employer: {
        resgitrationNumber: emp.employerABN || "",
        employerName: emp.employer || "",
      },
      employed__employerPhoneNumber: emp.employerPhone || "",
      employed__employerAddress: {
        formatted_address: formatAddress(emp.address),
        id: emp.address._id || "",
        address: {
          unit: emp.address?.unitNumber || "",
          streetNo: emp.address?.streetNumber || "",
          suburb: emp.address?.suburb,
          postalCode: emp.address?.postcode || "",
          state: emp.address?.state || "",
          country: emp.address?.country || "",
        },
      },
      timeEmployedYears: toNum(emp.yearsEmployed),
      timeEmployedMonths: toNum(emp.monthsEmployed),
    };
  });
}

function mapAssetsLiabilities(assetsLiabilities) {
  const { assets, liabilities } = assetsLiabilities;
  return {
    assets: (assets || []).map((s) => ({
      type: mapAssetType(clean(s.name)),
      description: s.description,
      value: toNum(s.value),
      consolidated: toTitledString(s.shared),
      isOwned: toTitledString(s.owned),
      balance: toNum(s.balance),
      monthlyPayment: toNum(s.monthlyRepayment),
      limit: toNum(s.limit),
      payout: toTitledString(s.payout),
      financier: mapLender(clean(s.financier)),
    })),
    liabilities: (liabilities || []).map((l) => ({
      type: mapLibType(clean(l.name)),
      description: l.description,
      value: toNum(l.value),
      consolidated: toTitledString(l.shared),
      balance: toNum(l.balance),
      monthlyPayment: toNum(l.monthlyRepayment),
      limit: toNum(l.limit),
      payout: toTitledString(l.payout),
      financier: mapLender(clean(l.financier)),
    })),
  };
}

function mapIncome(income) {
  return {
    netIncomeVerification: mapNetIncomeVerification(
      income.netIncomeVerification
    ),
    ytdNetFromPayslip: toNum(income.payslipNetIncome),
    employmentStartDate: income.currentEmploymentStartDate,
    payPeriodEndDate: income.payslipEndDate,
    payslipNetIncome: toNum(income.payslipNetIncome),
    primaryNetIncome: toNum(income.primaryNetIncome),
    investmentPropertyIncome: toNum(income.investmentPropertyIncome),
    governmentBenefitsIncome: toNum(income.governmentBenefits),
    otherIncome: toNum(income.otherIncome),
    totalAssessableMonthlyNetIncome: toNum(income.totalIncome),
  };
}

function mapExpense(expenses) {
  if (!Array.isArray(expenses?.expenses)) {
    return {};
  }

  const GROCERIES =
    expenses?.expenses.find((e) => e.name === "GROCERIES") || {};
  const TRANSPORT =
    expenses?.expenses.find((e) => e.name === "TRANSPORT") || {};
  const OTHER_INSURANCE =
    expenses?.expenses.find((e) => e.name === "OTHER_INSURANCE") || {};
  const CHILD_SUPPORT =
    expenses?.expenses.find((e) => e.name === "CHILD_SUPPORT") || {};
  const RENT_BOARD =
    expenses?.expenses.find((e) => e.name === "RENT_BOARD") || {};
  const PHONE_INTERNET =
    expenses?.expenses.find((e) => e.name === "PHONE_INTERNET") || {};
  const UTILITY = expenses?.expenses.find((e) => e.name === "UTILITY") || {};
  const RECREATION_ENTERTAINMENT =
    expenses?.expenses.find((e) => e.name === "RECREATION_ENTERTAINMENT") || {};
  const CLOTHING_PERSONAL_CARE =
    expenses?.expenses.find((e) => e.name === "CLOTHING_PERSONAL_CARE") || {};
  const PRIVATE_HEALTH_INSURANCE =
    expenses?.expenses.find((e) => e.name === "PRIVATE_HEALTH_INSURANCE") || {};
  const HEALTHCARE_COSTS =
    expenses?.expenses.find((e) => e.name === "HEALTHCARE_COSTS") || {};
  const PRIVATE_SCHOOLING_TUITION =
    expenses?.expenses.find((e) => e.name === "PRIVATE_SCHOOLING_TUITION") ||
    {};
  const CHILDCARE_ADULT_EDUCATION =
    expenses?.expenses.find((e) => e.name === "CHILDCARE_ADULT_EDUCATION") ||
    {};

  const OTHER = expenses?.expenses.find((e) => e.name === "OTHER") || {};

  return {
    groceriesAndPet: {
      amount: toNum(GROCERIES.value),
      frequency: toTitledString(GROCERIES.frequency),
    },
    transport: {
      amount: toNum(TRANSPORT.value),
      frequency: toTitledString(TRANSPORT.frequency),
    },
    otherInsurance: {
      amount: toNum(OTHER_INSURANCE.value),
      frequency: toTitledString(OTHER_INSURANCE.frequency),
    },
    childSupport: {
      amount: toNum(CHILD_SUPPORT.value),
      frequency: toTitledString(CHILD_SUPPORT.frequency),
    },
    rentBBoard: {
      amount: toNum(RENT_BOARD.value),
      frequency: toTitledString(RENT_BOARD.frequency),
    },
    telephoneInternetTV: {
      amount: toNum(PHONE_INTERNET.value),
      frequency: toTitledString(PHONE_INTERNET.frequency),
    },
    utilities: {
      amount: toNum(UTILITY.value),
      frequency: toTitledString(UTILITY.frequency),
    },
    recreationEntertainment: {
      amount: toNum(RECREATION_ENTERTAINMENT.value),
      frequency: toTitledString(RECREATION_ENTERTAINMENT.frequency),
    },
    clothing: {
      amount: toNum(CLOTHING_PERSONAL_CARE.value),
      frequency: toTitledString(CLOTHING_PERSONAL_CARE.frequency),
    },
    lifeAccidentIllnessHealthInsurance: {
      amount: toNum(PRIVATE_HEALTH_INSURANCE.value),
      frequency: toTitledString(PRIVATE_HEALTH_INSURANCE.frequency),
    },
    healthcare: {
      amount: toNum(HEALTHCARE_COSTS.value),
      frequency: toTitledString(HEALTHCARE_COSTS.frequency),
    },
    privateNonGovernmentSchoolFees: {
      amount: toNum(PRIVATE_SCHOOLING_TUITION.value),
      frequency: toTitledString(PRIVATE_SCHOOLING_TUITION.frequency),
    },
    clothingPersonalCare: {
      amount: toNum(CHILDCARE_ADULT_EDUCATION.value),
      frequency: toTitledString(CHILDCARE_ADULT_EDUCATION.frequency),
    },
    other: {
      amount: toNum(OTHER.value),
      frequency: toTitledString(OTHER.frequency),
    },
    foreseeableChanges: toTitledString(expenses.foreseeableChanges),
    foreseeableChangesExplanation: expenses.foreseeableChangesExplanation,
    totalExpenses: parseFloat(expenses.declaredMonthlyHouseholdExpenses || "0"),
  };
}

function toYesNo(b, d = "") {
  if (!b) return d;
  return b ? "Yes" : "No";
}
function toNum(v) {
  return v ? parseInt(v) : 0;
}
function clean(s) {
  return (s || "").replaceAll("_", " ");
}

function toTitledString(capitalizedStr) {
  if (!capitalizedStr) return "";
  return capitalizedStr
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function mapIdentityType(id) {
  if (id === "PHOTO_ID") return "Photo ID";
  if (id === "PASSPORT") return "Passport";
  if (id === "LICENCE") return "Driver Licence";
}

function mapApplicationType(value) {
  // map needed
  return toTitledString(value);
}

function mapCreditHistory(value) {
  // map needed
  return toTitledString(value);
}

function mapIndustry(title) {
  // map needed
  return toTitledString(title);
}

function mapAddressStatus(title) {
  // map needed
  return toTitledString(title);
}

function mapRentType(title) {
  // map needed
  return toTitledString(title);
}

function beneficiaryType(value) {
  // map needed
  return toTitledString(value);
}

function mapEntityType(value) {
  // map needed
  return toTitledString(value);
}

function mapSaleType(value) {
  // map needed
  return toTitledString(value);
}
function mapAssetCondition(value) {
  // map needed
  return toTitledString(value);
}

function mapAssetCategory(value) {
  // map needed
  return toTitledString(value);
}

function mapAssetType(value) {
  // map needed
  return toTitledString(value);
}

function mapLoanType(value) {
  // map needed
  return toTitledString(value);
}

function mapTitle(title) {
  // map needed
  return toTitledString(title);
}

function mapGender(value) {
  // map needed
  return toTitledString(value);
}

function mapMaritalStatus(value) {
  // map needed
  return toTitledString(value);
}

function mapCitizenship(value) {
  // map needed
  return toTitledString(value);
}
function mapVisaType(value) {
  // map needed
  return toTitledString(value);
}
function mapDriverLicenceClass(value) {
  // map needed
  return toTitledString(value);
}
function mapCountry(value) {
  // map needed
  return toTitledString(value);
}

function mapEmploymentStatus(value) {
  // map needed
  return toTitledString(value);
}

function mapOccupation(value) {
  // map needed
  return toTitledString(value);
}

function mapAssetType(value) {
  // map needed
  return toTitledString(value);
}

function mapLibType(value) {
  // map needed
  return toTitledString(value);
}

function mapLender(value) {
  // map needed
  return toTitledString(value);
}

function mapNetIncomeVerification(value) {
  // map needed
  return toTitledString(value);
}
