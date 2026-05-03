import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../ui/Input'
import { createRef } from 'react'

describe('Input Component', () => {
  it('should render input field', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
  })

  it('should render with label', () => {
    render(<Input label="Email" placeholder="Enter email" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('should render with error message', () => {
    render(<Input error="This field is required" placeholder="Input" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('should handle user input', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Type here" />)

    const input = screen.getByPlaceholderText('Type here') as HTMLInputElement
    await user.type(input, 'Hello')

    expect(input.value).toBe('Hello')
  })

  it('should forward ref correctly', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} placeholder="Input" />)

    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('should handle different input types', () => {
    const { container } = render(<Input type="password" placeholder="Password" />)
    const input = container.querySelector('input[type="password"]')
    expect(input).toBeInTheDocument()
  })

  it('should render with icon', () => {
    const { container } = render(
      <Input
        placeholder="Search"
        icon={<span data-testid="search-icon">🔍</span>}
      />
    )
    expect(screen.getByTestId('search-icon')).toBeInTheDocument()
  })

  it('should handle focus and blur events', async () => {
    const user = userEvent.setup()
    const handleFocus = jest.fn()
    const handleBlur = jest.fn()

    render(
      <Input
        placeholder="Test"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    )

    const input = screen.getByPlaceholderText('Test')
    await user.click(input)
    expect(handleFocus).toHaveBeenCalled()

    await user.click(document.body)
    expect(handleBlur).toHaveBeenCalled()
  })

  it('should be disabled when disabled prop is set', () => {
    render(<Input disabled placeholder="Disabled" />)
    const input = screen.getByPlaceholderText('Disabled') as HTMLInputElement
    expect(input.disabled).toBe(true)
  })

  it('should accept all HTML input attributes', () => {
    const { container } = render(
      <Input
        placeholder="Test"
        maxLength={10}
        minLength={5}
        required
        pattern="[0-9]*"
      />
    )

    const input = container.querySelector('input')
    expect(input?.maxLength).toBe(10)
    expect(input?.minLength).toBe(5)
    expect(input?.required).toBe(true)
    expect(input?.pattern).toBe('[0-9]*')
  })

  it('should apply custom className', () => {
    const { container } = render(
      <Input placeholder="Test" className="custom-class" />
    )
    const input = container.querySelector('input')
    expect(input?.className).toContain('custom-class')
  })
})
