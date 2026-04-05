import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const challengeCode = request.nextUrl.searchParams.get('challenge_code')

  if (!challengeCode) {
    return NextResponse.json({ error: 'Missing challenge_code' }, { status: 400 })
  }

  const verificationToken = process.env.EBAY_VERIFICATION_TOKEN!
  const endpoint = 'https://nebrasketball.com/api/ebay/account-deletion'

  const hash = createHash('sha256')
    .update(challengeCode + verificationToken + endpoint)
    .digest('hex')

  return NextResponse.json({ challengeResponse: hash })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('eBay deletion notification:', JSON.stringify(body))
  } catch {}
  return NextResponse.json({ success: true }, { status: 200 })
}
