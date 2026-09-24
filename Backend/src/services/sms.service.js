const env = require("../config/env");

class SmsService {
  /**
   * Generate random numeric OTP
   * @param {number} length
   * @returns {string}
   */
  generateOtp(length = 6) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }

  /**
   * Send Verification OTP to a mobile phone number
   * @param {string} phone
   * @param {string} otp
   * @returns {Promise<{ success: boolean, simulated: boolean, message: string }>}
   */
  async sendVerificationOtp(phone, otp) {
    const message = `Your MedAssist verification code is: ${otp}. This code is valid for 10 minutes. Please do not share it with anyone.`;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    // If real Twilio credentials are configured in .env, send via Twilio REST API
    if (accountSid && authToken && fromPhone) {
      try {
        const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
        const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
        
        const params = new URLSearchParams();
        params.append("To", phone);
        params.append("From", fromPhone);
        params.append("Body", message);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: params.toString()
        });

        if (!response.ok) {
          const errData = await response.json();
          console.warn("[Twilio SMS Error]:", errData);
          throw new Error(errData.message || "Failed to deliver SMS via Twilio");
        }

        console.log(`[SmsService] ✅ Real SMS sent via Twilio to ${phone}`);
        return {
          success: true,
          simulated: false,
          message: "SMS sent successfully"
        };
      } catch (err) {
        console.warn(`[SmsService] Twilio delivery failed, falling back to simulated log: ${err.message}`);
      }
    }

    // Default / Development Simulator
    console.log("\n=======================================================");
    console.log("📱 [MEDASSIST SMS GATEWAY SIMULATOR]");
    console.log(`➡️  Recipient Mobile: ${phone}`);
    console.log(`🔑 Verification OTP: ${otp}`);
    console.log(`💬 Message: "${message}"`);
    console.log(`⏰ Expiry: 10 minutes`);
    console.log("=======================================================\n");

    return {
      success: true,
      simulated: true,
      message: "OTP sent (Simulated in development mode)"
    };
  }
}

module.exports = new SmsService();
