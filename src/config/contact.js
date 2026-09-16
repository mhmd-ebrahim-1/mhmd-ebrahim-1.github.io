import { PROFILE } from '../data/index.js'

// Centralized Contact Configuration
export const CONTACT_EMAIL = 'mhmd_ebrahim_1@outlook.com'
export const WHATSAPP_PHONE = '201093556456'
export const WHATSAPP_DEFAULT_URL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hello Mohamed, I saw your portfolio and would like to discuss a project / opportunity.")}`

export function getEmailServiceUrl(serviceTitle, customSubject) {
  const subject = customSubject || `${serviceTitle} Project Inquiry`
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`
}

export function getWhatsAppServiceUrl(serviceTitle) {
  const message = `Hello Mohamed, I am interested in your ${serviceTitle} services.`
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
}

// Synchronize with PROFILE object
PROFILE.email = CONTACT_EMAIL
PROFILE.whatsappNumber = WHATSAPP_PHONE
PROFILE.whatsapp = WHATSAPP_DEFAULT_URL
