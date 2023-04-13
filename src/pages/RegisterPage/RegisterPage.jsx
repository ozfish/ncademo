import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Card from "../../components/Card/Card";
import "./RegisterPage.css";
import PaymentForm from "../../components/PaymentForm/PaymentForm";
import { getProducts } from "../../data/api";
import Footer from "../../components/Footer/Footer";

const NEXT_PAYMENT_DIFF_DAYS = 30;
const paymentDate = new Date();
paymentDate.setDate(paymentDate.getDate() + NEXT_PAYMENT_DIFF_DAYS);

const defaultFormData = {
  firstName: "",
  lastName: "",
  companyName: "",
  email: "",
  country: "",
  state: "",
  city: "",
  addr1: "",
  zip: "",
  startDate: new Date().toISOString().split("T")[0],
  promo: "",
  policyAccepted: false,
};

const getSelectedPlan = (plans) => {
  return plans[0];
};

const RegisterPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({ ...defaultFormData });

  useEffect(() => {
    getProducts().then((data) => {
      setSelectedPlan(getSelectedPlan(data));
    });
  }, []);

  return (
    <div>
      {/* <Navbar /> */}
      <div className="w-full page-content">
        <div className="flex justify-between">
          <div className="w-full form-description info-block">
            <div className="selection-block">
              <div className="text-center">
                <span className="header text-white f-16">Your selection</span>
              </div>
            </div>
            <div className="p-5">
              <div
                className="pc-image flex justify-center"
                style={{ margin: 100 }}
              >
                <img style={{ width: 100 }} src="/pc.png" alt="pc" />
              </div>
              <div className="flex column">
                {formData.promo && (
                  <div className="flex w-full justify-between">
                    <span className="secondary-text">
                      Payment every 4 weeks for the first 12 weeks
                    </span>
                    <span>
                      {selectedPlan?.currencySign} {selectedPlan?.salePrice}
                    </span>
                  </div>
                )}
                <div className="flex w-full justify-between">
                  <span className="secondary-text">
                    Payment every 4 weeks after that
                  </span>
                  <span>
                    {selectedPlan?.currencySign} {selectedPlan?.price}
                  </span>
                </div>
                <div className="flex w-full justify-between total-block">
                  <span className="bold">Today's Total</span>
                  <span className="bold">
                    {selectedPlan?.currencySign}{" "}
                    {formData.promo
                      ? selectedPlan?.salePrice
                      : selectedPlan?.price}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full billing-form">
            <Card>
              <PaymentForm
                formData={formData}
                setFormData={setFormData}
                plan={selectedPlan}
              />
            </Card>
          </div>
        </div>
        {/* <Footer position="fixed" /> */}
      </div>
      {/* <div className="register-background"></div> */}
    </div>
  );
};

export default RegisterPage;
