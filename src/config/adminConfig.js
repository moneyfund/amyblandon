const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const envEmails = String(import.meta.env.VITE_ADMIN_EMAILS || '').split(',');
const defaults = ['norvingarcia220@gmail.com'];

export const bootstrapAdminEmails = [...new Set([...defaults, ...envEmails].map(normalizeEmail).filter(Boolean))];
export const primaryBootstrapAdminEmail = defaults[0];
export const isBootstrapAdminEmail = (email) => bootstrapAdminEmails.includes(normalizeEmail(email));
export { normalizeEmail };
