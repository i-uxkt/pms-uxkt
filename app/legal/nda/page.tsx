
import React from 'react';

const NdaPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mutual Non-Disclosure Agreement (NDA)</h1>
      
      <div className="prose max-w-none">
        <p><strong>Parties:</strong></p>
        <ul>
          <li><strong>Shenzhen Top Shine Electronic Co., Ltd.</strong> ("Company")</li>
          <li>The user accepting this agreement ("Disclosing Party")</li>
        </ul>

        <p><strong>Effective Date:</strong> The date of acceptance by the Disclosing Party.</p>

        <h2>1. Purpose</h2>
        <p>The Parties intend to exchange certain Confidential Information (as defined below) solely for the purpose of evaluating and potentially engaging in a business relationship, including but not limited to design for manufacturability (DFM) analysis, supply chain matching, and project management ("the Purpose").</p>

        <h2>2. Definition of Confidential Information</h2>
        <p>"Confidential Information" means any and all non-public information, whether technical or commercial, disclosed by the Disclosing Party to the Company. This includes, without limitation, all drawings, CAD files, specifications, designs, intellectual property, business plans, and any other materials submitted through the Company's platform.</p>

        <h2>3. Obligations</h2>
        <p>The Company agrees:</p>
        <ol type="a">
          <li>To hold the Confidential Information in strict confidence and to take all reasonable precautions to protect such Confidential Information.</li>
          <li>Not to disclose any Confidential Information to any third party without the prior written consent of the Disclosing Party, except as required for the Purpose (e.g., to vetted and contractually bound suppliers for quotation purposes).</li>
          <li>To use the Confidential Information solely for the Purpose and for no other purpose whatsoever.</li>
        </ol>

        <h2>4. Term</h2>
        <p>This Agreement is effective from the Effective Date and shall remain in effect for a period of five (5) years. The obligation of confidentiality shall survive the termination of this Agreement.</p>

        <h2>5. Governing Law & Dispute Resolution</h2>
        <p>This Agreement shall be governed by the laws of Mainland China. Any dispute arising out of or in connection with this Agreement shall be submitted to confidential arbitration in Mainland China administered by the China International Economic and Trade Arbitration Commission (CIETAC).</p>
      </div>
    </div>
  );
};

export default NdaPage;
