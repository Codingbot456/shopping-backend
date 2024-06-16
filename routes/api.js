const express = require('express');
const router = express.Router();
const fs = require('fs');
const moment = require('moment');
const axios = require('axios');
const { getAccessToken, processStkPush, registerC2BUrl } = require('../services/mpesaService');

// Root route
router.get("/", (req, res) => {
  res.send("MPESA DARAJA API WITH NODE JS BY UMESKIA SOFTWARES");
  const timeStamp = moment().format("YYYYMMDDHHmmss");
  console.log(timeStamp);
});

// Access token route
router.get("/access_token", (req, res) => {
  getAccessToken()
    .then((accessToken) => {
      res.send("😀 Your access token is " + accessToken);
    })
    .catch(console.log);
});

// STK push route
router.post("/stkpush", (req, res) => {
  const { phoneNumber, amount } = req.body;
  getAccessToken()
    .then((accessToken) => {
      processStkPush(accessToken, phoneNumber, amount, req, res);
    })
    .catch(console.log);
});

// STK push callback route
router.post("/callback", (req, res) => {
  console.log("STK PUSH CALLBACK");
  const { Body: { stkCallback } } = req.body;
  const { CheckoutRequestID, ResultCode } = stkCallback;

  if (ResultCode === 0) {
    // Payment successful
    console.log("Payment successful for CheckoutRequestID: ", CheckoutRequestID);
    // Perform any necessary actions for successful payment
  } else {
    // Payment failed or was not completed
    console.log("Payment failed for CheckoutRequestID: ", CheckoutRequestID);
    // Perform any necessary actions for failed or incomplete payment
  }

  const json = JSON.stringify(req.body);
  fs.writeFile("stkcallback.json", json, "utf8", (err) => {
    if (err) {
      return console.log(err);
    }
    console.log("STK PUSH CALLBACK JSON FILE SAVED");
  });
  console.log(req.body);
});

// Register URL for C2B route
router.get("/registerurl", (req, res) => {
  getAccessToken()
    .then((accessToken) => {
      registerC2BUrl(accessToken, res);
    })
    .catch(console.log);
});

router.get("/confirmation", (req, res) => {
  console.log("All transaction will be sent to this URL");
  console.log(req.body);
});

router.get("/validation", (req, res) => {
  console.log("Validating payment");
  console.log(req.body);
});

// B2C route or auto withdrawal
router.get("/b2curlrequest", (req, res) => {
  getAccessToken()
    .then((accessToken) => {
      const securityCredential = process.env.SECURITY_CREDENTIAL;
      const url = "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest";
      const auth = "Bearer " + accessToken;
      axios.post(url, {
        InitiatorName: "testapi",
        SecurityCredential: securityCredential,
        CommandID: "PromotionPayment",
        Amount: "1",
        PartyA: "600996",
        PartyB: "", // phone number to receive the payment
        Remarks: "Withdrawal",
        QueueTimeOutURL: "https://mydomain.com/b2c/queue",
        ResultURL: "https://mydomain.com/b2c/result",
        Occasion: "Withdrawal",
      }, { headers: { Authorization: auth } })
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("❌ Request failed");
      });
    })
    .catch(console.log);
});

module.exports = router;