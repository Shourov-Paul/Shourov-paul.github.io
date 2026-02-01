'use client'

import { useState } from 'react'
import Button from '../UI/Button'
import Input from '../UI/Input'
import Textarea from '../UI/Textarea'

const ContactForm = () => {
  const [isPending, setIsPending] = useState(false)
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setStatus(null)

    // Rate Limiting (1 minute)
    const lastSent = localStorage.getItem('lastSent')
    if (lastSent && Date.now() - parseInt(lastSent) < 60000) {
      setIsPending(false)
      setStatus({ success: false, message: 'Please wait a minute before sending another message.' })
      return
    }

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    const email = data.email as string

    // Strict Email Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      setIsPending(false)
      setStatus({ success: false, message: 'Please enter a valid email address.' })
      return
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: '4a9de8ff-372c-4d55-9bce-fdf01a2cb440',
          subject: data.subject || 'New Contact Form Submission',
          botcheck: data.botcheck, // Honeypot
          ...data,
        }),
      })
      const result = await response.json()
      if (result.success) {
        setStatus({ success: true, message: 'Message sent successfully!' })
        localStorage.setItem('lastSent', Date.now().toString())
      } else {
        setStatus({ success: false, message: result.message || 'Something went wrong.' })
      }
    } catch (error) {
      setStatus({ success: false, message: 'Failed to send message. Please try again later.' })
    } finally {
      setIsPending(false)
    }
  }

  if (status?.success) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-accent text-2xl font-medium">{status.message}</p>
        <span
          onClick={() => setStatus(null)}
          className="text-neutral hover:text-accent cursor-pointer text-lg underline decoration-1 underline-offset-4 transition-colors duration-300">
          Send another response
        </span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Honeypot Field - Hidden from users */}
      <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

      <Input label="Full name" id="name" name="name" placeholder="Your name here" required />
      <Input
        label="Email address"
        id="email"
        type="email"
        name="email"
        placeholder="Your email address here"
        required
      />
      <Input label="Subject" id="subject" name="subject" placeholder="Your subject here" />
      <Textarea
        label="Message"
        id="message"
        name="message"
        placeholder="Your message here"
        rows={7}
        required
      />
      {!status?.success && status?.message && <p className="my-2 font-light text-red-600">{status?.message}</p>}
      <Button text={isPending ? 'Submitting...' : 'Submit'} disabled={isPending} />
    </form>
  )
}

export default ContactForm
