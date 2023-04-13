import React, { useState } from "react";
import {
  getAccountByName,
  createAccount,
  createBillingProfile,
  createAccountProduct,
  createUser,
} from "../../data/api";
import Loader from "../Loader/Loader";
import "./PaymentForm.css";

const formSteps = {
  BILLING_CONTACT: 0,
  PAYMENT_DETAILS: 1,
};

let savedAccount;

const envURL = process.env.REACT_APP_BP_URL.replace("/rest/2.0", "");

const PaymentForm = ({ plan, formData, setFormData }) => {
  const [formState, setFormState] = useState({ status: "", message: "" });
  const [step, setStep] = useState(formSteps.BILLING_CONTACT);

  const onChangePolicyAccepted = (e) => {
    setFormData({ ...formData, policyAccepted: e.target.checked });
  };

  const buildPaymentForm = (hostedPaymentPageExternalId) => {
    const script = document.createElement("script");
    const onSuccess = async () => {
      setFormState({ status: "loading", message: "" });
      try {
        await createAccountProduct(
          savedAccount?.Id,
          formData.startDate,
          !!formData.promo
        );
        await createUser(savedAccount?.Id, formData.email);
        window.location.href = envURL;
      } catch (e) {
        setFormState({ status: "error", message: JSON.stringify(e) });
      }
    };
    script.src =
      "https://cdn.aws.billingplatform.com/hosted-payments-ui@release/lib.js";
    document.body.append(script);
    script.onload = function () {
      window.HostedPayments.renderPaymentForm(
        {
          targetSelector: "#payment-form",
          // amount: Number(plan?.price),
          walletMode: true,
          apiUrl: `${envURL}/hostedPayments/1.0`,
          paymentGateways: {
            creditCard: { gateway: "Stripe_CC" },
            directDebit: { gateway: "Stripe_DD" },
          },
          environmentId: process.env.REACT_APP_ENV_ID,
          billingProfileId: hostedPaymentPageExternalId,
        },
        {
          successCapture: onSuccess,
          addPaymentMethod: onSuccess,
        }
      );
    };
  };

  const validateForm = () => {
    let error;
    if (step === formSteps.BILLING_CONTACT) {
      if (!formData.firstName) {
        error = "First Name is required";
      } else if (!formData.lastName) {
        error = "Last Name is required";
      } else if (!formData.companyName) {
        error = "Account name is required";
      } else if (!formData.email) {
        error = "Email is required";
      } else if (!formData.country) {
        error = "Country is required";
      } else if (!formData.state) {
        error = "State is required";
      } else if (!formData.city) {
        error = "City is required";
      } else if (!formData.addr1) {
        error = "Address is required";
      } else if (!formData.zip) {
        error = "Zip is required";
      }
    }
    if (error) {
      setFormState({
        status: "error",
        message: error,
      });
      return false;
    } else {
      setFormState({
        status: "",
        message: "",
      });
      return true;
    }
  };

  const onFormSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    savedAccount = null;

    try {
      setFormState({ status: "loading", message: "" });
      savedAccount = await getAccountByName(formData.companyName);

      if (!savedAccount) {
        savedAccount = await createAccount(formData.companyName);
      }

      if (!savedAccount.HostedPaymentPageExternalId) {
        savedAccount.HostedPaymentPageExternalId = await createBillingProfile(
          savedAccount.Id,
          formData
        );
      }
      // await createAccountProduct(savedAccount.Id, plan.id);
      setFormState({ status: "", message: "" });
      setStep(formSteps.PAYMENT_DETAILS);
      buildPaymentForm(savedAccount.HostedPaymentPageExternalId);
    } catch (e) {
      console.log(e);
      setFormState({ status: "error", message: "API error" });
    }
  };

  const onChangeField = (e) => {
    const copy = { ...formData };
    copy[e.target.name] = e.target.value;
    setFormData(copy);
  };

  const onFieldBlur = (e) => {
    const copy = { ...formData };
    copy[e.target.name] = (copy[e.target.name] || "").trim();
    setFormData(copy);
  };

  return (
    <div>
      {formState.status === "loading" && <Loader />}
      {step !== formSteps.PAYMENT_DETAILS && (
        <div className="billing-contact-form">
          <h2 className="form-header bold">Enter your details</h2>
          <div className="flex column">
            <span className="grey-text">
              You may already have an account with{" "}
              <a href={envURL} target="_blank" rel="noreferrer">
                us
              </a>
              .
            </span>
            <span className="grey-text">
              Subscribe with your existing account{" "}
              <a href={envURL} target="_blank" rel="noreferrer">
                here
              </a>
              .
            </span>
          </div>
          <span style={{ color: "red" }}>{formState.message}</span>
          <div
            className="form-fields"
            style={step !== formSteps.BILLING_CONTACT ? { opacity: 0.7 } : {}}
          >
            <span className="form-label form-label">Name</span>
            <div className="flex form-input name-input">
              <input
                placeholder="First Name"
                name="firstName"
                disabled={step === formSteps.PAYMENT_DETAILS}
                value={formData.firstName}
                onChange={onChangeField}
                onBlur={onFieldBlur}
              />
              <input
                placeholder="Last Name"
                name="lastName"
                disabled={step === formSteps.PAYMENT_DETAILS}
                value={formData.lastName}
                onChange={onChangeField}
              />
            </div>
            <span className="form-label form-label">Account name</span>
            <input
              className="form-input"
              placeholder="Account name"
              name="companyName"
              disabled={step === formSteps.PAYMENT_DETAILS}
              value={formData.companyName}
              onChange={onChangeField}
            />
            <span className="form-label form-label">Email address</span>
            <input
              className="form-input"
              placeholder="Email"
              name="email"
              disabled={step === formSteps.PAYMENT_DETAILS}
              value={formData.email}
              onChange={onChangeField}
            />
            <span className="form-label form-label">Country</span>
            <input
              className="form-input"
              placeholder="Country"
              name="country"
              disabled={step === formSteps.PAYMENT_DETAILS}
              value={formData.country}
              onChange={onChangeField}
            />
            <span className="form-label form-label">State</span>
            <input
              className="form-input"
              placeholder="State"
              name="state"
              disabled={step === formSteps.PAYMENT_DETAILS}
              value={formData.state}
              onChange={onChangeField}
            />
            <span className="form-label form-label">City</span>
            <input
              className="form-input"
              placeholder="City"
              name="city"
              disabled={step === formSteps.PAYMENT_DETAILS}
              value={formData.city}
              onChange={onChangeField}
            />
            <span className="form-label form-label">Address</span>
            <input
              className="form-input"
              placeholder="Address"
              name="addr1"
              disabled={step === formSteps.PAYMENT_DETAILS}
              value={formData.addr1}
              onChange={onChangeField}
            />
            <span className="form-label form-label">Zip</span>
            <input
              className="form-input"
              placeholder="Zip"
              name="zip"
              disabled={step === formSteps.PAYMENT_DETAILS}
              value={formData.zip}
              onChange={onChangeField}
            />
            <span className="form-label form-label">Start Date</span>
            <input
              className="form-input"
              placeholder="Start Date"
              type="date"
              name="startDate"
              disabled={step === formSteps.PAYMENT_DETAILS}
              value={formData.startDate}
              onChange={onChangeField}
            />
            <span className="form-label form-label">Promo code</span>
            <input
              className="form-input"
              placeholder="Promo code"
              name="promo"
              disabled={step === formSteps.PAYMENT_DETAILS}
              value={formData.promo}
              onChange={onChangeField}
            />
          </div>
          <div className="flex">
            <input
              style={{ height: 30 }}
              type="checkbox"
              name="promo"
              disabled={step === formSteps.PAYMENT_DETAILS}
              checked={formData.policyAccepted}
              onChange={onChangePolicyAccepted}
            />
            <span className="form-label form-label my-auto ml-2">
              I have read and agreed policy
            </span>
          </div>
          <button
            onClick={onFormSubmit}
            className="step-btn"
            disabled={
              step === formSteps.PAYMENT_DETAILS || !formData.policyAccepted
            }
          >
            Next
          </button>
        </div>
      )}
      <div id="payment-form"></div>
    </div>
  );
};

export default PaymentForm;
