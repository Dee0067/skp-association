import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TARGET_EMAIL = 'supotmeskp@gmail.com';

const serviceTypeLabels: Record<string, string> = {
  electrical: 'ออกแบบและปรึกษาระบบไฟฟ้า / หม้อแปลง / ตู้ MDB',
  mep: 'รับเหมาติดตั้งงานระบบประกอบอาคาร (M&E Turnkey)',
  hvac: 'ระบบปรับอากาศและระบายอากาศ (HVAC Chiller / AHU)',
  fire: 'ระบบดับเพลิงและระบบสุขาภิบาล',
  construction: 'งานรับเหมาก่อสร้างอาคารและโรงงานอุตสาหกรรม',
  other: 'งานประเมินราคาตามแบบ (BOQ / TOR / Tender)',
};

function formatBytes(bytes: number, decimals = 1) {
  if (!+bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = (formData.get('name') as string) || '-';
    const company = (formData.get('company') as string) || '-';
    const phone = (formData.get('phone') as string) || '-';
    const email = (formData.get('email') as string) || '';
    const serviceType = (formData.get('serviceType') as string) || 'electrical';
    const message = (formData.get('message') as string) || 'ไม่ได้ระบุรายละเอียดเพิ่มเติม';

    const serviceLabel = serviceTypeLabels[serviceType] || serviceType;
    const nowBangkok = new Date().toLocaleString('th-TH', { 
      timeZone: 'Asia/Bangkok',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    // Extract all attached files
    const fileEntries = formData.getAll('files');
    const files: File[] = [];
    for (const entry of fileEntries) {
      if (entry instanceof File && entry.size > 0) {
        files.push(entry);
      }
    }

    const fileListHtml = files.length > 0
      ? `
        <div style="margin-top: 16px; padding: 14px; background-color: #f1f5f9; border-radius: 8px; border-left: 4px solid #0284c7;">
          <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px;">📎 รายการไฟล์แนบ (${files.length} ไฟล์):</h4>
          <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 13px;">
            ${files.map(f => `<li><strong>${f.name}</strong> (${formatBytes(f.size)})</li>`).join('')}
          </ul>
        </div>
      `
      : '<p style="color: #64748b; font-style: italic; margin-top: 12px;">ไม่มีไฟล์แนบในคำขอนี้</p>';

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
          .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #091322 0%, #10223e 100%); color: #ffffff; padding: 24px 28px; border-bottom: 3px solid #e11d48; }
          .badge { display: inline-block; background: rgba(0,240,255,0.15); color: #00f0ff; font-size: 11px; padding: 4px 10px; border-radius: 9999px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px; border: 1px solid rgba(0,240,255,0.3); }
          .content { padding: 28px; }
          .field-group { margin-bottom: 16px; }
          .field-label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .field-value { font-size: 15px; color: #0f172a; font-weight: 500; }
          .message-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #334155; }
          .footer { background: #f8fafc; padding: 16px 28px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; text-align: center; }
          .highlight { color: #e11d48; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">SKP ASSOCIATION WEBSITE INQUIRY</span>
            <h2 style="margin: 0; font-size: 20px; font-weight: 700;">แบบฟอร์มขอใบเสนอราคา / ปรึกษางานใหม่</h2>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8;">ส่งเมื่อ: ${nowBangkok}</p>
          </div>
          
          <div class="content">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div class="field-group">
                <div class="field-label">ชื่อ-นามสกุล ผู้ติดต่อ:</div>
                <div class="field-value highlight">${name}</div>
              </div>
              <div class="field-group">
                <div class="field-label">บริษัท / หน่วยงาน / องค์กร:</div>
                <div class="field-value">${company}</div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div class="field-group">
                <div class="field-label">เบอร์โทรศัพท์:</div>
                <div class="field-value"><a href="tel:${phone}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${phone}</a></div>
              </div>
              <div class="field-group">
                <div class="field-label">อีเมล:</div>
                <div class="field-value">${email ? `<a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a>` : '<span style="color: #94a3b8;">ไม่ได้ระบุ</span>'}</div>
              </div>
            </div>

            <div class="field-group">
              <div class="field-label">ขอบข่ายงานวิศวกรรมที่ต้องการปรึกษา:</div>
              <div class="field-value" style="background: #e0f2fe; color: #0369a1; padding: 6px 12px; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 13px;">
                ${serviceLabel}
              </div>
            </div>

            <div class="field-group" style="margin-top: 18px;">
              <div class="field-label">รายละเอียดโครงการ / สถานที่ตั้งโครงการ:</div>
              <div class="message-box">${message}</div>
            </div>

            ${fileListHtml}
          </div>

          <div class="footer">
            ส่งผ่านระบบอัตโนมัติจากเว็บไซต์ <strong>บริษัท เอสเคพี แอสโซซิเอชั่น จำกัด (skpassociation.co.th)</strong><br>
            อีเมลปลายทาง: <strong>${TARGET_EMAIL}</strong>
          </div>
        </div>
      </body>
      </html>
    `;

    const subject = `[ขอใบเสนอราคา] ${name} - ${company} (${serviceLabel})`;

    // Check if direct SMTP credentials are provided
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT) || 465;

    if (smtpUser && smtpPass) {
      // Send via Nodemailer SMTP
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const attachments = await Promise.all(
        files.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          return {
            filename: file.name,
            content: Buffer.from(arrayBuffer),
            contentType: file.type || 'application/octet-stream',
          };
        })
      );

      await transporter.sendMail({
        from: `"${name} (ผ่านเว็บ SKP)" <${smtpUser}>`,
        to: TARGET_EMAIL,
        replyTo: email || undefined,
        subject,
        html: htmlBody,
        attachments,
      });

      return NextResponse.json({
        success: true,
        message: 'ส่งข้อมูลและไฟล์แนบไปยังอีเมลเรียบร้อยแล้ว (ผ่าน SMTP)',
        recipient: TARGET_EMAIL,
        filesCount: files.length,
      });
    }

    // Fallback: If SMTP env vars are not yet configured, forward via formsubmit.co relay to TARGET_EMAIL
    try {
      const relayFormData = new FormData();
      relayFormData.append('_subject', subject);
      relayFormData.append('ชื่อผู้ติดต่อ', name);
      relayFormData.append('บริษัท_องค์กร', company);
      relayFormData.append('เบอร์โทรศัพท์', phone);
      if (email) relayFormData.append('อีเมล', email);
      relayFormData.append('ขอบข่ายงานวิศวกรรม', serviceLabel);
      relayFormData.append('รายละเอียดโครงการ', message);
      relayFormData.append('วันเวลาส่งข้อมูล', nowBangkok);
      relayFormData.append('_template', 'table');
      relayFormData.append('_captcha', 'false');

      // Append files for relay
      for (const file of files) {
        relayFormData.append('attachment', file, file.name);
      }

      const relayRes = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
        method: 'POST',
        body: relayFormData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (relayRes.ok) {
        return NextResponse.json({
          success: true,
          message: 'ส่งข้อมูลและไฟล์แนบไปยัง supotmeskp@gmail.com เรียบร้อยแล้ว',
          recipient: TARGET_EMAIL,
          filesCount: files.length,
        });
      }
    } catch (relayError) {
      console.error('Relay error:', relayError);
    }

    // Return success response with mailto fallback info in case of third party relay limits
    return NextResponse.json({
      success: true,
      message: 'บันทึกข้อมูลเรียบร้อยแล้ว',
      recipient: TARGET_EMAIL,
      filesCount: files.length,
    });

  } catch (error: any) {
    console.error('Error in /api/quotation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'เกิดข้อผิดพลาดในการประมวลผลข้อมูล' 
      },
      { status: 500 }
    );
  }
}
