# Production Deployment Checklist

## 1. Environment Configuration
- [ ] Set up production environment variables in `.env.production`
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_STRIPE_PUBLISHABLE_KEY`
  - [ ] `STRIPE_SECRET_KEY` (for Supabase Edge Functions)
  - [ ] `STRIPE_WEBHOOK_SECRET`

## 2. Database & Security
- [ ] Run all migrations on production database
- [ ] Verify Row Level Security (RLS) policies
- [ ] Set up database backups
  - [ ] Configure automated daily backups
  - [ ] Test backup restoration
- [ ] Enable SSL/TLS for database connections

## 3. Authentication & Authorization
- [ ] Configure Supabase Auth settings
  - [ ] Set up email templates
  - [ ] Configure password policies
  - [ ] Set up rate limiting for auth endpoints
- [ ] Test user roles and permissions

## 4. Payment Integration
- [ ] Configure Stripe production keys
- [ ] Set up Stripe webhooks
- [ ] Test payment flow end-to-end
- [ ] Configure payment failure notifications

## 5. Email Service
- [ ] Set up transactional email service
- [ ] Configure email templates
  - [ ] Welcome emails
  - [ ] Booking confirmations
  - [ ] Payment receipts
  - [ ] Password reset

## 6. Monitoring & Logging
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure performance monitoring
- [ ] Set up logging
  - [ ] Application logs
  - [ ] Access logs
  - [ ] Error logs
- [ ] Set up uptime monitoring

## 7. Security
- [ ] Configure security headers
  - [ ] CSP (Content Security Policy)
  - [ ] HSTS
  - [ ] X-Frame-Options
  - [ ] X-Content-Type-Options
- [ ] Enable rate limiting for API endpoints
- [ ] Set up DDoS protection
- [ ] Configure CORS policies

## 8. Performance
- [ ] Enable CDN for static assets
- [ ] Configure caching policies
- [ ] Optimize database queries
- [ ] Enable compression

## 9. Testing
- [ ] Run end-to-end tests in production environment
- [ ] Test all critical user flows
- [ ] Load testing
- [ ] Security testing

## 10. Documentation
- [ ] Update API documentation
- [ ] Document deployment process
- [ ] Create incident response plan
- [ ] Document backup/restore procedures

## 11. Legal & Compliance
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Cookie policy
- [ ] GDPR compliance (if applicable)

## 12. Post-Deployment
- [ ] Monitor error rates
- [ ] Watch server metrics
- [ ] Test all critical features
- [ ] Verify email delivery
- [ ] Check payment processing