
import React from 'react';

const MsaPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Master Service Agreement (MSA)</h1>

      <div className="prose max-w-none">
        <h2>1. Scope of Work</h2>
        <p>Shenzhen Top Shine Electronic Co., Ltd. ("Company") provides the following services:</p>
        <ol type="a">
          <li>Design for Manufacturability (DFM) analysis and reporting.</li>
          <li>Supplier matching and quotation based on the technical drawings and specifications provided by the Client.</li>
          <li>Project management and communication coordination.</li>
          <li>Quality monitoring based on the agreed-upon inspection standards.</li>
        </ol>
        <p>The Company's services expressly exclude:</p>
        <ol type="a">
          <li>Original product design or engineering services.</li>
          <li>Guarantees of fitness for the Client's final application.</li>
          <li>Performance warranties beyond the scope of the provided drawings and specifications.</li>
        </ol>

        <h2>2. Acceptance Criteria</h2>
        <p>The final acceptance criteria for delivered products shall be based strictly on the dimensions, tolerances, materials, and surface finish requirements specified in the final version of the 2D drawings and 3D models provided by the Client. The Client shall complete inspection and raise any objections within fifteen (15) calendar days of receiving the goods. Failure to provide written objection within this period will be deemed as acceptance of the products.</p>

        <h2>3. Limitation of Liability</h2>
        <p>IN NO EVENT SHALL SHENZHEN TOP SHINE ELECTRONIC CO., LTD.'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT, WHETHER IN CONTRACT, TORT OR UNDER ANY OTHER THEORY OF LIABILITY, EXCEED THE TOTAL AMOUNT PAID BY THE CLIENT FOR THE SPECIFIC ORDER GIVING RISE TO THE CLAIM. SHENZHEN TOP SHINE ELECTRONIC CO., LTD. SHALL NOT BE LIABLE FOR ANY INDIRECT, CONSEQUENTIAL, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOST PROFITS, LOSS OF DATA, OR BUSINESS INTERRUPTION, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
      </div>
    </div>
  );
};

export default MsaPage;
