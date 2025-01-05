import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SMTPClient } from "https://deno.land/x/smtp/mod.ts";

const client = new SMTPClient({
  connection: {
    hostname: Deno.env.get('SMTP_HOST')!,
    port: parseInt(Deno.env.get('SMTP_PORT')!),
    tls: true,
    auth: {
      username: Deno.env.get('SMTP_USER')!,
      password: Deno.env.get('SMTP_PASS')!,
    },
  },
});

serve(async (req) => {
  try {
    const { to, subject, html, text } = await req.json();

    await client.send({
      from: Deno.env.get('EMAIL_FROM')!,
      to,
      subject,
      content: text,
      html: html,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
});