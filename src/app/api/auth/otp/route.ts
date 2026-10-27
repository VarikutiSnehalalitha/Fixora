import { NextResponse } from 'next/server';

// In-memory OTP storage for dev simulation
const otpCache = new Map<string, { otp: string; expiresAt: number }>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, phone, enteredOtp } = body;

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '');

    if (action === 'send_otp') {
      // Generate 4-digit OTP
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 min expiry
      otpCache.set(cleanPhone, { otp, expiresAt });

      return NextResponse.json({
        success: true,
        message: 'OTP dispatched successfully via SMS gateway (Dev simulated)',
        devOtp: otp, // Provided in response for easy testing
        expiresInSeconds: 300
      });
    }

    if (action === 'verify_otp') {
      if (!enteredOtp) {
        return NextResponse.json({ success: false, error: 'Entered OTP is required' }, { status: 400 });
      }

      // Default demo bypass OTP: '1234' or matched generated OTP
      const cached = otpCache.get(cleanPhone);
      const isValid = enteredOtp === '1234' || (cached && cached.otp === enteredOtp && cached.expiresAt > Date.now());

      if (!isValid) {
        return NextResponse.json({ success: false, error: 'Invalid or expired OTP code' }, { status: 400 });
      }

      otpCache.delete(cleanPhone);
      return NextResponse.json({
        success: true,
        message: 'Phone verified successfully'
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
