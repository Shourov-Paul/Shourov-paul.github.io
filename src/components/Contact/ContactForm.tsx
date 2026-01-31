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

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsPending(false)
    setStatus({
      success: true,
      message: 'Thank you! The form is currently in demo mode on GitHub Pages.'
    })
  }

  if (status?.success) {
    return (
      <p className="text-accent self-center text-center text-2xl font-medium">{status.message}</p>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
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
