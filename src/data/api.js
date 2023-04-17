// import { plans } from "../data/api-mock";

let sessionId;

export const login = async () => {
  try {
    const { loginResponse } = await fetch(
      `${process.env.REACT_APP_BP_URL}/login`,
      {
        method: "POST",
        body: JSON.stringify({
          username: process.env.REACT_APP_USER_LOGIN,
          password: process.env.REACT_APP_USER_PASS,
        }),
      }
    ).then((resp) => resp.json());
    if (loginResponse && loginResponse.length && loginResponse[0].SessionID) {
      sessionId = loginResponse[0].SessionID;
    }
  } catch (e) {
    return null;
  }
};

export const getAccountType = async () => {
  try {
    const accountTypeResponse = await fetch(
      `${process.env.REACT_APP_BP_URL}/query?sql=SELECT Id FROM ACCOUNT_TYPE WHERE AccountType = 'Consumer'`,
      { headers: { sessionId } }
    ).then((resp) => resp.json());
    return accountTypeResponse?.queryResponse?.[0]?.Id;
  } catch (e) {
    return null;
  }
};

export const createAccount = async (name) => {
  try {
    await fetch(`${process.env.REACT_APP_BP_URL}/ACCOUNT`, {
      method: "POST",
      body: JSON.stringify({
        brmObjects: [
          {
            Name: name,
            Status: "ACTIVE",
            Owner: "NCAConsumer",
            ClientSegment: "Consumer",
            AccountTypeId: await getAccountType(),
          },
        ],
      }),
      headers: { sessionId },
    }).then((resp) => resp.json());
    return await getAccountByName(name);
  } catch (e) {
    return null;
  }
};

export const createBillingProfile = async (AccountId, formData) => {
  try {
    const requestBody = {
      Address1: formData.addr1,
      Email: formData.email,
      Country: formData.country,
      City: formData.city,
      State: formData.state,
      Zip: formData.zip,
      TimeZoneId: "0",
      CurrencyCode: "AUD",
      MonthlyBillingDate: 31,
      // BillingMethod: "MAIL",
      BillingMethod: "Electronic Payment",
      BillingCycle: "52-53 WEEK CALENDAR",
      CalendarType: "4-4-4",
      CalendarClosingMonth: "June",
      CalendarClosingWeekday: "Sunday",
      ManualCloseFlag: "1",
      InvoiceApprovalFlag: "1",
      PaymentTermDays: "14",
      BillTo: `${formData.firstName} ${formData.lastName}`,
      InvoiceTemplateId: await findDefaultInvoiceTemplateId(),
      Status: "ACTIVE",
      AccountId,
    };
    const bpResponse = await fetch(
      `${process.env.REACT_APP_BP_URL}/BILLING_PROFILE`,
      {
        method: "POST",
        body: JSON.stringify({
          brmObjects: [requestBody],
        }),
        headers: { sessionId },
      }
    ).then((resp) => resp.json());
    requestBody.Id = bpResponse.createResponse[0].Id;
    await fetch(`${process.env.REACT_APP_BP_URL}/BILLING_PROFILE`, {
      method: "PUT",
      body: JSON.stringify({
        brmObjects: [requestBody],
      }),
      headers: { sessionId },
    });

    const savedBP = await fetch(
      `${process.env.REACT_APP_BP_URL}/query?sql=SELECT bp.HostedPaymentPageExternalId FROM Billing_Profile bp WHERE bp.Id = ${bpResponse?.createResponse?.[0].Id}`,
      { headers: { sessionId } }
    ).then((resp) => resp.json());
    return savedBP?.queryResponse[0].HostedPaymentPageExternalId;
  } catch (e) {
    return null;
  }
};

export const createAccountProduct = async (
  AccountId,
  inputStartDate,
  promo
) => {
  try {
    const { queryResponse } = await fetch(
      `${process.env.REACT_APP_BP_URL}/QUERY?sql=SELECT Id as ProductId FROM Product WHERE Name = 'The Australian Digital'`,
      { headers: { sessionId } }
    ).then((resp) => resp.json());
    const { ProductId } = queryResponse[0];
    const StartDate = inputStartDate || new Date().toISOString().split("T")[0];
    const EndDate = new Date(StartDate);
    EndDate.setFullYear(EndDate.getFullYear() + 1);
    EndDate.setDate(EndDate.getDate() - 1);
    await fetch(`${process.env.REACT_APP_BP_URL}/ACCOUNT_PRODUCT`, {
      method: "POST",
      body: JSON.stringify({
        brmObjects: [
          {
            Quantity: 1,
            Status: "ACTIVE",
            StartDate,
            EndDate: EndDate.toISOString().split("T")[0],
            ProductId,
            AccountId,
          },
        ],
      }),
      headers: { sessionId },
    }).then((resp) => resp.json());
    if (promo) {
      const promotionResponse = await fetch(
        `${process.env.REACT_APP_BP_URL}/QUERY?sql=SELECT Id as ProductId FROM Product WHERE ExternalKey = 'PROMOTION'`,
        { headers: { sessionId } }
      ).then((resp) => resp.json());
      const discountEndDate = new Date(StartDate);
      discountEndDate.setDate(discountEndDate.getDate() + 7 * 12);
      await fetch(`${process.env.REACT_APP_BP_URL}/ACCOUNT_PRODUCT`, {
        method: "POST",
        body: JSON.stringify({
          brmObjects: [
            {
              Quantity: 1,
              Status: "ACTIVE",
              StartDate,
              EndDate: discountEndDate.toISOString().split("T")[0],
              ProductId: promotionResponse.queryResponse[0].ProductId,
              AccountId,
            },
          ],
        }),
        headers: { sessionId },
      }).then((resp) => resp.json());
    }
    // const savedBP = await fetch(
    //   `${process.env.REACT_APP_BP_URL}/query?sql=SELECT bp.HostedPaymentPageExternalId FROM Billing_Profile bp WHERE bp.Id = ${bpResponse?.createResponse?.[0].Id}`,
    //   { headers: { sessionId } }
    // ).then((resp) => resp.json());
    // return savedBP?.queryResponse[0].HostedPaymentPageExternalId;
  } catch (e) {
    return null;
  }
};

export const createUser = async (AccountId, Email) => {
  // debugger;
  const { queryResponse } = await fetch(
    `${process.env.REACT_APP_BP_URL}/QUERY?sql=SELECT eu.LanguageCode, eu.TimeZoneId, eu.RoleId FROM External_User eu JOIN Role r ON eu.RoleId = r.Id WHERE r.Name = 'CUSTOMER PORTAL USER' AND rownum < 2`,
    { headers: { sessionId } }
  ).then((resp) => resp.json());
  const { LanguageCode, TimeZoneId, RoleId } = queryResponse[0];
  await fetch(`${process.env.REACT_APP_BP_URL}/EXTERNAL_USER`, {
    body: JSON.stringify({
      brmObjects: {
        Email,
        AccountId,
        LanguageCode,
        TimeZoneId,
        RoleId,
        Username: Email,
        Status: "ACTIVE",
      },
    }),
    headers: { sessionId },
    method: "POST",
  })
    .then((resp) => resp.json())
    .then(console.log);
};

export const getAccountByName = async (name) => {
  try {
    // if (!sessionId) {
    //   await login();
    // }
    const accountResponse = await fetch(
      `${process.env.REACT_APP_BP_URL}/query?sql=SELECT a.Id, bp.HostedPaymentPageExternalId FROM Account a LEFT JOIN Billing_Profile bp ON bp.AccountId = a.Id WHERE a.Name = '${name}'`,
      { headers: { sessionId } }
    ).then((resp) => resp.json());
    return accountResponse?.queryResponse?.[0];
  } catch (e) {
    return null;
  }
};

export const getProducts = async () => {
  return [
    {
      id: 1,
      currencySign: "$",
      title: "Digital",
      fullTitle: "Full Digital Access",
      salePaymentInfo: "Payment every 4 weeks for the first 12 weeks",
      salePrice: 0,
      price: 7,
      description: [
        "Full access to The Australian website and app",
        "Full access to The Wall Street Journal",
        "Subscriber only newsletter briefings",
        "The Australian Plus member benefits program",
      ],
    },
  ];
};

const findDefaultInvoiceTemplateId = async () => {
  const { queryResponse } = await fetch(
    `${process.env.REACT_APP_BP_URL}/query?sql=SELECT Id FROM Invoice_Template WHERE Name = 'Default Invoice Template'`,
    {
      headers: {
        sessionId,
      },
    }
  ).then((resp) => resp.json());
  return queryResponse?.[0].Id;
};

const originalFetch = fetch;
// eslint-disable-next-line
fetch = function () {
  let self = this;
  let args = arguments;
  return originalFetch.apply(self, args).then(async function (data) {
    if (data.status === 500) {
      const initialResponse = await data.json();
      const { errors } = initialResponse;
      if (
        errors &&
        errors.length &&
        errors[0].error_code === "INVALID_SESSION_ID"
      ) {
        await login();
      }
      args[1].headers.sessionId = sessionId;
      return originalFetch.apply(self, args);
    }
    return data;
  });
};
