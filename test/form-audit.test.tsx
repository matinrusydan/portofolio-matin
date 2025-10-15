import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { CertificateForm } from '@/components/admin/CertificateForm'
import { ContactForm } from '@/components/contact/contact-form'

// Mock console.log to capture form submit logs
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

// Mock toast notifications
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('react-hot-toast', () => ({
  default: vi.fn(),
}))

// Mock file storage for image uploads
vi.mock('@/lib/file-storage', () => ({
  saveFile: vi.fn().mockResolvedValue('mock-image-path'),
  deleteFile: vi.fn().mockResolvedValue(undefined),
}))

// Mock fetch for API calls
global.fetch = vi.fn()

describe('Form Submission Audit', () => {
  beforeEach(() => {
    consoleSpy.mockClear()
    vi.clearAllMocks()
  })

  describe('ProjectForm', () => {
    it('should trigger handleFormSubmit with valid data', async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined)
      const user = userEvent.setup()

      render(<ProjectForm onSubmit={mockOnSubmit} />)

      // Fill required fields
      await user.type(screen.getByLabelText(/title/i), 'Test Project')
      await user.type(screen.getByLabelText(/description/i), 'Test Description')

      // Add technology
      await user.type(screen.getByPlaceholderText(/add technology/i), 'React')
      await user.click(screen.getByRole('button', { name: /plus/i }))

      // Submit form
      await user.click(screen.getByRole('button', { name: /create project/i }))

      // Verify form submit was triggered
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Form submit triggered with data:', expect.any(Object))
        expect(consoleSpy).toHaveBeenCalledWith('TechStack from state:', ['React'])
      })

      // Verify onSubmit was called
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.any(FormData))
    })

    it('should show validation error for empty techStack', async () => {
      const mockOnSubmit = vi.fn()
      const user = userEvent.setup()

      render(<ProjectForm onSubmit={mockOnSubmit} />)

      // Fill required fields but leave techStack empty
      await user.type(screen.getByLabelText(/title/i), 'Test Project')
      await user.type(screen.getByLabelText(/description/i), 'Test Description')

      // Submit form
      await user.click(screen.getByRole('button', { name: /create project/i }))

      // Verify validation error is shown
      await waitFor(() => {
        expect(screen.getByText(/at least one technology is required/i)).toBeInTheDocument()
      })

      // Verify form submit was NOT triggered
      expect(consoleSpy).not.toHaveBeenCalledWith('Form submit triggered with data:', expect.any(Object))
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  describe('CertificateForm', () => {
    it('should trigger handleFormSubmit with valid data', async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined)
      const user = userEvent.setup()

      render(<CertificateForm onSubmit={mockOnSubmit} />)

      // Fill required fields
      await user.type(screen.getByLabelText(/certificate title/i), 'Test Certificate')
      await user.type(screen.getByLabelText(/issuer/i), 'Test Issuer')

      // Submit form
      await user.click(screen.getByRole('button', { name: /create certificate/i }))

      // Verify onSubmit was called (CertificateForm doesn't have console logs)
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.any(FormData))
    })
  })

  describe('ContactForm', () => {
    it('should trigger onSubmit with valid data', async () => {
      const user = userEvent.setup()

      // Mock successful fetch
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      })

      render(<ContactForm />)

      // Fill required fields
      await user.type(screen.getByLabelText(/name/i), 'Test User')
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/message/i), 'This is a test message with enough characters')

      // Submit form
      await user.click(screen.getByRole('button', { name: /submit/i }))

      // Verify fetch was called
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test message with enough characters',
        }),
      })
    })
  })
})