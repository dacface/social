import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
    }

    // Mock AI Analysis Processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock Result based on hypothetical post analysis
    const result = {
      credibilityScore: 78,
      bias: "Ușor înclinat spre stânga politic, cu nuanțe social-democrate.",
      factCheckSummary: "Majoritatea afirmațiilor sunt extrase din surse oficiale (INS, BNR). Totuși, contextul prezentat ignoră anumiți factori macroeconomici externi, făcând informația parțial incompletă.",
      verdict: 'Suspect' // 'Verificat' | 'Suspect' | 'Fals'
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analyze API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
