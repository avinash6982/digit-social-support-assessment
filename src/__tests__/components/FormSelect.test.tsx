import { render, screen } from '@testing-library/react'
import FormSelect from '../../components/FormSelect'

let mockIsRtl = false
jest.mock('../../hooks/useLanguage', () => ({
  useLanguage: () => ({ isRtl: mockIsRtl, t: (k: string) => k }),
}))

beforeEach(() => { mockIsRtl = false })

describe('FormSelect', () => {
  function renderSelect(props = {}) {
    return render(
      <FormSelect id="gender" label="Gender" {...props}>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </FormSelect>
    )
  }

  it('renders a label and select', () => {
    renderSelect()
    expect(screen.getByLabelText('Gender')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders the provided option children', () => {
    renderSelect()
    expect(screen.getByText('Male')).toBeInTheDocument()
    expect(screen.getByText('Female')).toBeInTheDocument()
  })

  it('does not show error message without error prop', () => {
    renderSelect()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders error message when error prop is provided', () => {
    renderSelect({ error: 'Selection required' })
    expect(screen.getByRole('alert')).toHaveTextContent('Selection required')
  })

  it('sets aria-invalid on the select when there is an error', () => {
    renderSelect({ error: 'Required' })
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('sets aria-describedby linking select to error', () => {
    renderSelect({ error: 'Required' })
    const select = screen.getByRole('combobox')
    expect(select).toHaveAttribute('aria-describedby', 'gender-error')
    expect(screen.getByRole('alert')).toHaveAttribute('id', 'gender-error')
  })

  it('does not set aria-invalid without an error', () => {
    renderSelect()
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-invalid')
  })

  it('applies text-right alignment in RTL mode', () => {
    mockIsRtl = true
    renderSelect()
    const select = screen.getByRole('combobox')
    expect(select.className).toContain('text-right')
  })

  it('positions the chevron on the left in RTL mode', () => {
    mockIsRtl = true
    const { container } = renderSelect()
    const chevronWrapper = container.querySelector('[aria-hidden="true"]')
    expect(chevronWrapper?.className).toContain('left-0')
  })

  it('appends extra className to the select', () => {
    renderSelect({ className: 'custom-select' })
    const select = screen.getByRole('combobox')
    expect(select.className).toContain('custom-select')
  })

  it('applies colSpan class when colSpan is true', () => {
    const { container } = renderSelect({ colSpan: true })
    expect(container.firstChild).toHaveClass('md:col-span-2')
  })
})
