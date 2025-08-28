
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { ProjectSubmitEmail } from '../../../components/ProjectSubmitEmail';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema
const ProjectSubmissionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').refine(val => !/[<>"'&]/.test(val), 'Invalid characters in name'),
  email: z.string().email('Invalid email').max(254, 'Email too long'),
  projectName: z.string().min(1, 'Project name is required').max(200, 'Project name too long').refine(val => !/[<>"'&]/.test(val), 'Invalid characters in project name'),
  material: z.enum(['aluminum', 'steel', 'plastic', 'titanium', 'copper', 'other']),
  quantity: z.string().regex(/^\d+$/, 'Quantity must be a number').transform(Number).refine(n => n > 0 && n <= 100000, 'Invalid quantity'),
  surfaceTreatment: z.string().max(200, 'Surface treatment description too long').refine(val => !/[<>"'&]/.test(val), 'Invalid characters'),
  tolerance: z.string().max(100, 'Tolerance description too long').refine(val => !/[<>"'&]/.test(val), 'Invalid characters'),
  deliveryDate: z.string().max(50, 'Delivery date too long'),
  destination: z.string().max(200, 'Destination too long').refine(val => !/[<>"'&]/.test(val), 'Invalid characters'),
  additionalNotes: z.string().max(2000, 'Additional notes too long').optional(),
});

// File validation constants
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/dwg',
  'application/step',
  'application/stp',
  'model/step',
  'application/x-step',
  'application/octet-stream' // Some CAD files might be detected as this
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }
  
  // Check file extension as fallback
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.dwg', '.step', '.stp'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  if (!ALLOWED_FILE_TYPES.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
    return { valid: false, error: 'Invalid file type. Allowed: PDF, JPG, PNG, DWG, STEP' };
  }
  
  return { valid: true };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extract and validate form data
    const formDataObject = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      projectName: formData.get('projectName') as string,
      material: formData.get('material') as string,
      quantity: formData.get('quantity') as string,
      surfaceTreatment: formData.get('surfaceTreatment') as string || '',
      tolerance: formData.get('tolerance') as string || '',
      deliveryDate: formData.get('deliveryDate') as string || '',
      destination: formData.get('destination') as string || '',
      additionalNotes: formData.get('additionalNotes') as string || '',
    };

    // Validate form data
    const validatedData = ProjectSubmissionSchema.parse(formDataObject);

    const file3D = formData.get('file3D') as File | null;
    const file2D = formData.get('file2D') as File | null;

    // Validate files if present
    if (file3D && file3D.size > 0) {
      const validation = validateFile(file3D);
      if (!validation.valid) {
        return NextResponse.json({ error: `3D File: ${validation.error}` }, { status: 400 });
      }
    }
    
    if (file2D && file2D.size > 0) {
      const validation = validateFile(file2D);
      if (!validation.valid) {
        return NextResponse.json({ error: `2D File: ${validation.error}` }, { status: 400 });
      }
    }

    const attachments = [];
    if (file3D && file3D.size > 0) {
      // Sanitize filename
      const sanitizedFilename = file3D.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      attachments.push({
        filename: sanitizedFilename,
        content: Buffer.from(await file3D.arrayBuffer()),
      });
    }
    if (file2D && file2D.size > 0) {
      // Sanitize filename
      const sanitizedFilename = file2D.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      attachments.push({
        filename: sanitizedFilename,
        content: Buffer.from(await file2D.arrayBuffer()),
      });
    }

    const emailComponent = ProjectSubmitEmail({
      name: validatedData.name,
      email: validatedData.email,
      projectName: validatedData.projectName,
      material: validatedData.material,
      quantity: validatedData.quantity.toString(),
      surfaceTreatment: validatedData.surfaceTreatment,
      tolerance: validatedData.tolerance,
      deliveryDate: validatedData.deliveryDate,
      destination: validatedData.destination,
      additionalNotes: validatedData.additionalNotes || '',
    });

    const toEmails = process.env.TO_EMAIL!.split(',').map(email => email.trim());

    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: toEmails,
      subject: `New Project Submission: ${validatedData.projectName}`,
      react: emailComponent as any,
      attachments: attachments,
    });

    return NextResponse.json({ message: 'Email sent successfully', data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return NextResponse.json({ error: `Validation failed: ${errorMessages}` }, { status: 400 });
    }
    
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
