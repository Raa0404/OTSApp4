
import React, { useState } from "react";
import "./App.css";
import data from "./data.json";

export default function App() {
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState({ name: "", branch: "" });
  const [language, setLanguage] = useState("en");
  const [accountInput, setAccountInput] = useState("");
  const [result, setResult] = useState(null);

  const handleLogin = () => {
    if (userInfo.name && userInfo.branch) setStep(2);
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setStep(3);
  };

  const handleSearch = () => {
    const main = data.find((d) => d.ACCOUNT === accountInput);
    if (!main) return setResult("not_found");

    const allCIF = data.filter((d) => d["CIF ID"] === main["CIF ID"]);
    const maxPercent = Math.max(...allCIF.map((d) => d["%"]));
    const otherAccounts = allCIF.filter((d) => d.ACCOUNT !== main.ACCOUNT);
    const minSettlement = (main["CIF balance"] * maxPercent) / 100;

    setResult({
      name: main["ACCT_NAME"],
      cif: main["CIF ID"],
      total: main["No. of A/C"],
      other: otherAccounts.map((d) => d.ACCOUNT),
      balance: main["CIF CURRENT BAL"],
      settlement: minSettlement,
      npa: main["Actual NPA Date"],
    });
  };

  if (step === 1) {
    return (
      <div className="app">
        <h2>Login</h2>
        <input placeholder="Name" onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} />
        <input placeholder="Branch" onChange={(e) => setUserInfo({ ...userInfo, branch: e.target.value })} />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="app">
        <h2>Select Language</h2>
        <button onClick={() => handleLanguageSelect("en")}>English</button>
        <button onClick={() => handleLanguageSelect("hi")}>हिन्दी</button>
      </div>
    );
  }

  return (
    <div className="app">
      <h2>{language === "hi" ? "खाता नंबर दर्ज करें" : "Enter Account Number"}</h2>
      <input value={accountInput} onChange={(e) => setAccountInput(e.target.value)} placeholder="e.g. 8725CF00000310" />
      <button onClick={handleSearch}>{language === "hi" ? "खोजें" : "Search"}</button>

      {result === "not_found" && <p>{language === "hi" ? "खाता नहीं मिला।" : "Account not found."}</p>}
      {result && result !== "not_found" && (
        <div className="result">
          <p><strong>{language === "hi" ? "नाम" : "Name"}:</strong> {result.name}</p>
          <p><strong>CIF ID:</strong> {result.cif}</p>
          <p><strong>{language === "hi" ? "कुल खाते" : "Number of Accounts"}:</strong> {result.total}</p>
          <p><strong>{language === "hi" ? "अन्य खाते" : "Other Accounts"}:</strong> {result.other.join(', ') || "None"}</p>
          <p><strong>{language === "hi" ? "CIF शेष राशि" : "CIF Balance"}:</strong> ₹{result.balance.toLocaleString()}</p>
          <p><strong>{language === "hi" ? "न्यूनतम सेटलमेंट" : "Min. Settlement"}:</strong> ₹{result.settlement.toLocaleString()}</p>
          <p><strong>{language === "hi" ? "एनपीए तिथि" : "NPA Date"}:</strong> {result.npa}</p>
        </div>
      )}
    </div>
  );
}
