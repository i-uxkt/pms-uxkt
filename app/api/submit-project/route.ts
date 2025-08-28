
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { ProjectSubmitEmail } from '../../../components/ProjectSubmitEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const projectName = formData.get('projectName') as string;
    const material = formData.get('material') as string;
    const quantity = formData.get('quantity') as string;
    const surfaceTreatment = formData.get('surfaceTreatment') as string;
    const tolerance = formData.get('tolerance') as string;
    const deliveryDate = formData.get('deliveryDate') as string;
    const destination = formData.get('destination') as string;
    const additionalNotes = formData.get('additionalNotes') as string;

    const file3D = formData.get('file3D') as File | null;
    const file2D = formData.get('file2D') as File | null;

    const attachments = [];
    if (file3D) {
      attachments.push({
        filename: file3D.name,
        content: Buffer.from(await file3D.arrayBuffer()),
      });
    }
    if (file2D) {
      attachments.push({
        filename: file2D.name,
        content: Buffer.from(await file2D.arrayBuffer()),
      });
    }

    const emailComponent = ProjectSubmitEmail({
      name,
      email,
      projectName,
      material,
      quantity,
      surfaceTreatment,
      tolerance,
      deliveryDate,
      destination,
      additionalNotes,
    } as any);

    const toEmails = process.env.TO_EMAIL!.split(',').map(email => email.trim());

    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: toEmails,
      subject: `New Project Submission: ${projectName}`,
      react: emailComponent as any,
      attachments: attachments,
    });

    return NextResponse.json({ message: 'Email sent successfully', data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
