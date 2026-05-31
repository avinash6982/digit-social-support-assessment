import { render, screen } from '@testing-library/react'
import FormField from '../../components/FormField'

let mockIsRtl = false
jest.mock('../../hooks/useLanguage', () => ({
  useLanguage: () => ({ isRtl: mockIsRtl, t: (k: string) => k }),
}))

beforeEach(() => { mockIsRtl = false })

describe('FormField', () => {
  it('renders a label and input', () => {
    render(<FormField id="name" label="Full Name" />)
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
  })

  it('passes placeholder to the input', () => {
    render(<FormField id="email" label="Email" placeholder="e.g. you@example.com" />)
    expect(screen.getByPlaceholderText('e.g. you@example.com')).toBeInTheDocument()
  })

  it('does not render an error message without error prop', () => {
    render(<FormField id="name" label="Name" />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders an error message when error prop is provided', () => {
    render(<FormField id="name" label="Name" error="This field is required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required')
  })

  it('sets aria-invalid on the input when there is an error', () => {
    render(<FormField id="name" label="Name" error="Required" />)
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true')
  })

  it('sets aria-describedby linking the input to the error', () => {
    render(<FormField id="name" label="Name" error="Required" />)
    const input = screen.getByLabelText('Name')
    expect(input).toHaveAttribute('aria-describedby', 'name-error')
    expect(screen.getByRole('alert')).toHaveAttribute('id', 'name-error')
  })

  it('does not set aria-invalid without an error', () => {
    render(<FormField id="name" label="Name" />)
    expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-invalid')
  })

  it('applies md:col-span-2 when colSpan is true', () => {
    const { container } = render(<FormField id="name" label="Name" colSpan />)
    expect(container.firstChild).toHaveClass('md:col-span-2')
  })

  it('applies text-right alignment in RTL mode', () => {
    mockIsRtl = true
    render(<FormField id="name" label="Name" />)
    const input = screen.getByLabelText('Name')
    expect(input.className).toContain('text-right')
  })

  it('appends extra className to the input', () => {
    render(<FormField id="name" label="Name" className="custom-class" />)
    const input = screen.getByLabelText('Name')
    expect(input.className).toContain('custom-class')
  })
})
