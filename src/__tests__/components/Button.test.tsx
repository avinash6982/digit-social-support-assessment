import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../../components/Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Submit</Button>)
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('applies primary variant classes by default', () => {
    render(<Button>Click me</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-gradient-to-r')
  })

  it('applies secondary variant classes', () => {
    render(<Button variant="secondary">Back</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-indigo-500/10')
  })

  it('calls onClick handler when clicked', async () => {
    const handler = jest.fn()
    render(<Button onClick={handler}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('forwards ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref button</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    expect(ref.current?.textContent).toBe('Ref button')
  })

  it('passes through HTML button attributes', () => {
    render(<Button type="submit" disabled>Save</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('type', 'submit')
  })

  it('renders an icon when provided', () => {
    render(<Button icon={<span data-testid="icon">→</span>}>Go</Button>)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })
})
