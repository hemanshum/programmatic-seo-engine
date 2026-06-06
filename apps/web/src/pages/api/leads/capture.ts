import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: Integrate with your email service (ConvertKit, Mailchimp, etc.)
    // TODO: Save to your CRM (HubSpot, Salesforce, Airtable)
    // TODO: Send welcome email

    console.log('Lead captured:', {
      email: data.email,
      name: data.name,
      company: data.company,
      phone: data.phone,
      source: data.source || 'website',
      page: data.page,
      timestamp: new Date().toISOString(),
    });

    // Example: Send to Airtable, Zapier webhook, or your backend
    // const zapierWebhook = 'https://hooks.zapier.com/hooks/catch/...';
    // await fetch(zapierWebhook, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you! Check your email for the guide.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
