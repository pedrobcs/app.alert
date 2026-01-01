import { NextResponse } from 'next/server';

const MAX_SELFIE_BYTES = 5 * 1024 * 1024; // 5MB

function getRequiredString(form: FormData, key: string) {
  const value = form.get(key);
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const firstName = getRequiredString(form, 'firstName');
    const lastName = getRequiredString(form, 'lastName');
    const dateOfBirth = getRequiredString(form, 'dateOfBirth');
    const countryOfCitizenship = getRequiredString(form, 'countryOfCitizenship');
    const email = getRequiredString(form, 'email');
    const phone = getRequiredString(form, 'phone');
    const middleNameRaw = form.get('middleName');
    const middleName = typeof middleNameRaw === 'string' ? middleNameRaw.trim() : '';

    const selfie = form.get('selfie');
    if (!(selfie instanceof File)) {
      return NextResponse.json({ ok: false, error: 'Selfie is required.' }, { status: 400 });
    }
    if (!selfie.type.startsWith('image/')) {
      return NextResponse.json({ ok: false, error: 'Selfie must be an image file.' }, { status: 400 });
    }
    if (selfie.size > MAX_SELFIE_BYTES) {
      return NextResponse.json({ ok: false, error: 'Selfie is too large (max 5MB).' }, { status: 400 });
    }

    if (!firstName || !lastName || !dateOfBirth || !countryOfCitizenship || !email || !phone) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields.' },
        { status: 400 },
      );
    }

    // NOTE: This endpoint currently does not persist data. It simply validates input and returns a confirmation ID.
    // You can later store these fields in a database or forward them to a trusted system.
    const confirmationId = crypto.randomUUID();

    return NextResponse.json({
      ok: true,
      confirmationId,
      received: {
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        countryOfCitizenship,
        email,
        phone,
        selfie: { name: selfie.name, type: selfie.type, size: selfie.size },
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid form submission.' }, { status: 400 });
  }
}

