import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyWebhookSignature } from '@/lib/teller';

// Use service role client for webhook processing (no user session)
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  const signingSecret = process.env.TELLER_SIGNING_SECRET;
  if (!signingSecret) {
    return NextResponse.json({ error: 'Teller not configured' }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get('teller-signature') || '';

  // Verify signature
  if (!verifyWebhookSignature(body, signature, signingSecret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: { type: string; payload: { enrollment_id?: string; reason?: string } };
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const supabase = getAdminClient();

  switch (payload.type) {
    case 'enrollment.disconnected': {
      // Bank disconnected -- mark as disconnected
      if (payload.payload.enrollment_id) {
        await supabase
          .from('bank_connections')
          .update({ status: 'disconnected' })
          .eq('enrollment_id', payload.payload.enrollment_id);
      }
      break;
    }

    case 'enrollment.stale': {
      // Credentials need refresh
      if (payload.payload.enrollment_id) {
        await supabase
          .from('bank_connections')
          .update({ status: 'stale' })
          .eq('enrollment_id', payload.payload.enrollment_id);
      }
      break;
    }

    default:
      // Acknowledge unknown events without error
      break;
  }

  return NextResponse.json({ received: true });
}
