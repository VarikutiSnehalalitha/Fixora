import { NextResponse } from 'next/server';
import { fixNowStore } from '@/lib/store';
import { BookingStatus } from '@/types';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, note, otp, actorRole = 'system', actorId = 'system' } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: 'Status is required' }, { status: 400 });
    }

    const booking = fixNowStore.getBookingById(params.id);
    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    // OTP validation if transitioning to ARRIVED
    if (status === 'ARRIVED') {
      if (otp) {
        const isVerified = fixNowStore.verifyArrivalOtp(params.id, otp);
        if (!isVerified) {
          return NextResponse.json(
            { success: false, error: 'Invalid Arrival OTP. Please check customer app.' },
            { status: 400 }
          );
        }
      } else {
        fixNowStore.updateBookingStatus(params.id, 'ARRIVED', note || 'Provider reached customer location', {
          is_arrival_verified: true
        });
      }
    } else if (status === 'COMPLETED') {
      // OTP validation if transitioning to COMPLETED
      if (otp) {
        const isVerified = fixNowStore.verifyCompletionOtp(params.id, otp);
        if (!isVerified) {
          return NextResponse.json(
            { success: false, error: 'Invalid Completion OTP. Customer must provide the 4-digit code.' },
            { status: 400 }
          );
        }
      } else {
        fixNowStore.updateBookingStatus(params.id, 'COMPLETED', note || 'Job marked completed', {
          is_completion_verified: true
        });
      }
    } else {
      // Standard state machine transition
      const result = fixNowStore.updateBookingStatus(params.id, status as BookingStatus, note);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 422 });
      }
    }

    // Record audit log
    fixNowStore.addAuditLog({
      actor_id: actorId,
      actor_role: actorRole,
      action: `BOOKING_STATUS_CHANGE_TO_${status}`,
      target_resource: 'bookings',
      target_id: params.id,
      details: { newStatus: status, note }
    });

    const updated = fixNowStore.getBookingById(params.id);
    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
