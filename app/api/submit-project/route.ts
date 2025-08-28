
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
  'image/jpg'
];

const ALLOWED_CAD_EXTENSIONS = ['.step', '.stp', '.dwg', '.dxf', '.igs', '.iges'];
const DANGEROUS_EXTENSIONS = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar', '.zip', '.rar', '.7z'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// File signature validation (magic numbers)
const FILE_SIGNATURES = {
  'PDF': [0x25, 0x50, 0x44, 0x46], // %PDF
  'JPEG': [0xFF, 0xD8, 0xFF],
  'PNG': [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
};

function checkFileSignature(buffer: ArrayBuffer, expectedSignature: number[]): boolean {
  const uint8Array = new Uint8Array(buffer);
  for (let i = 0; i < expectedSignature.length; i++) {
    if (uint8Array[i] !== expectedSignature[i]) {
      return false;
    }
  }
  return true;
}

async function validateFile(file: File): Promise<{ valid: boolean; error?: string }> {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }
  
  if (file.size === 0) {
    return { valid: false, error: 'Empty file not allowed' };
  }
  
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
  
  // Strict dangerous file extension check
  if (DANGEROUS_EXTENSIONS.includes(fileExtension)) {
    return { valid: false, error: 'Dangerous file type detected' };
  }
  
  // Check for double extensions (e.g., file.pdf.exe)
  const extensionParts = fileName.split('.');
  if (extensionParts.length > 2) {
    for (let i = 1; i < extensionParts.length - 1; i++) {
      if (DANGEROUS_EXTENSIONS.includes('.' + extensionParts[i])) {
        return { valid: false, error: 'Suspicious double extension detected' };
      }
    }
  }
  
  // Validate known file types with magic number verification
  if (ALLOWED_FILE_TYPES.includes(file.type)) {
    const buffer = await file.arrayBuffer();
    
    if (file.type === 'application/pdf') {
      if (!checkFileSignature(buffer, FILE_SIGNATURES.PDF)) {
        return { valid: false, error: 'Invalid PDF file signature' };
      }
    } else if (file.type.startsWith('image/jpeg')) {
      if (!checkFileSignature(buffer, FILE_SIGNATURES.JPEG)) {
        return { valid: false, error: 'Invalid JPEG file signature' };
      }
    } else if (file.type === 'image/png') {
      if (!checkFileSignature(buffer, FILE_SIGNATURES.PNG)) {
        return { valid: false, error: 'Invalid PNG file signature' };
      }
    }
    
    return { valid: true };
  }
  
  // Allow CAD files by extension only (safer than application/octet-stream)
  if (ALLOWED_CAD_EXTENSIONS.includes(fileExtension)) {
    // Additional safety: check file doesn't start with executable signatures
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    
    // Check for PE executable header (Windows executables)
    if (uint8Array[0] === 0x4D && uint8Array[1] === 0x5A) { // MZ header
      return { valid: false, error: 'Executable file disguised as CAD file' };
    }
    
    // Check for ELF header (Linux executables)  
    if (uint8Array[0] === 0x7F && uint8Array[1] === 0x45 && uint8Array[2] === 0x4C && uint8Array[3] === 0x46) {
      return { valid: false, error: 'Executable file disguised as CAD file' };
    }
    
    return { valid: true };
  }
  
  return { valid: false, error: `File type not allowed. Allowed: PDF, JPG, PNG, STEP, STP, DWG, DXF, IGS, IGES` };
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
      const validation = await validateFile(file3D);
      if (!validation.valid) {
        console.log(`3D file validation failed: ${validation.error}`);
        return NextResponse.json({ error: `3D File: ${validation.error}` }, { status: 400 });
      }
    }
    
    if (file2D && file2D.size > 0) {
      const validation = await validateFile(file2D);
      if (!validation.valid) {
        console.log(`2D file validation failed: ${validation.error}`);
        return NextResponse.json({ error: `2D File: ${validation.error}` }, { status: 400 });
      }
    }

    const attachments = [];
    if (file3D && file3D.size > 0) {
      // Sanitize filename
      const sanitizedFilename = file3D.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const fileBuffer = Buffer.from(await file3D.arrayBuffer());
      console.log(`Processing 3D file: ${sanitizedFilename}, size: ${fileBuffer.length} bytes`);
      
      attachments.push({
        filename: sanitizedFilename,
        content: fileBuffer
      });
    }
    if (file2D && file2D.size > 0) {
      // Sanitize filename
      const sanitizedFilename = file2D.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const fileBuffer = Buffer.from(await file2D.arrayBuffer());
      console.log(`Processing 2D file: ${sanitizedFilename}, size: ${fileBuffer.length} bytes`);
      
      attachments.push({
        filename: sanitizedFilename,
        content: fileBuffer
      });
    }
    
    console.log(`Total attachments: ${attachments.length}`);

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
    console.log(`Sending email to: ${toEmails.join(', ')}`);

    const emailData: any = {
      from: process.env.FROM_EMAIL!,
      to: toEmails,
      subject: `New Project Submission: ${validatedData.projectName}`,
      react: emailComponent as any,
    };
    
    // Only include attachments if there are any
    if (attachments.length > 0) {
      emailData.attachments = attachments;
      console.log(`Sending email with ${attachments.length} attachments`);
    } else {
      console.log('Sending email without attachments');
    }

    const data = await resend.emails.send(emailData);

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
