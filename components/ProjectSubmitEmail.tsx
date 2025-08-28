
import * as React from 'react';

interface ProjectSubmitEmailProps {
  name: string;
  email: string;
  projectName: string;
  material: string;
  quantity: string;
  surfaceTreatment: string;
  tolerance: string;
  deliveryDate: string;
  destination: string;
  additionalNotes: string;
}

export const ProjectSubmitEmail: React.FC<Readonly<ProjectSubmitEmailProps>> = ({ 
  name,
  email,
  projectName,
  material,
  quantity,
  surfaceTreatment,
  tolerance,
  deliveryDate,
  destination,
  additionalNotes
}) => (
  <div>
    <h1>New Project Submission: {projectName}</h1>
    <p>A new project has been submitted through the website. Details are below:</p>
    
    <h2>Contact Information</h2>
    <ul>
      <li><strong>Name:</strong> {name}</li>
      <li><strong>Work Email:</strong> {email}</li>
    </ul>

    <h2>Project Details</h2>
    <ul>
      <li><strong>Project Name:</strong> {projectName}</li>
      <li><strong>Material:</strong> {material}</li>
      <li><strong>Quantity:</strong> {quantity}</li>
      <li><strong>Surface Treatment:</strong> {surfaceTreatment}</li>
      <li><strong>Key Tolerance Information:</strong> {tolerance}</li>
    </ul>

    <h2>Logistics</h2>
    <ul>
      <li><strong>Expected Delivery Date:</strong> {deliveryDate}</li>
      <li><strong>Destination:</strong> {destination}</li>
    </ul>

    <h2>Additional Notes</h2>
    <p>{additionalNotes}</p>

    <p>The submitted 3D and 2D files are attached to this email.</p>
  </div>
);
