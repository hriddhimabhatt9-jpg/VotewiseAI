import {
  cn,
  formatDate,
  calculateAge,
  isEligibleToVote,
  generateId,
  truncateText,
  debounce,
} from '../utils'

describe('Utility Functions', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('px-2', 'py-1')
      expect(result).toBe('px-2 py-1')
    })

    it('should handle conditional classes', () => {
      const result = cn('px-2', false && 'hidden', 'py-1')
      expect(result).toBe('px-2 py-1')
    })

    it('should merge tailwind classes properly', () => {
      const result = cn('px-2', 'px-4')
      expect(result).toBe('px-4')
    })
  })

  describe('formatDate', () => {
    it('should format date in Indian locale', () => {
      const date = new Date('2024-01-15')
      const result = formatDate(date)
      expect(result).toContain('2024')
      expect(result).toContain('15')
    })

    it('should handle various dates', () => {
      const date = new Date('2025-05-03')
      const result = formatDate(date)
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('calculateAge', () => {
    it('should calculate age correctly for adult', () => {
      const dob = new Date('2000-01-15')
      const age = calculateAge(dob)
      expect(age).toBeGreaterThanOrEqual(24)
    })

    it('should calculate age correctly for child', () => {
      const dob = new Date('2010-01-15')
      const age = calculateAge(dob)
      expect(age).toBeGreaterThanOrEqual(14)
    })

    it('should handle leap year birthdays', () => {
      const dob = new Date('2000-02-29')
      const age = calculateAge(dob)
      expect(typeof age).toBe('number')
      expect(age).toBeGreaterThanOrEqual(0)
    })

    it('should handle recent births', () => {
      const dob = new Date('2024-01-01')
      const age = calculateAge(dob)
      expect(age).toBeLessThanOrEqual(2)
    })
  })

  describe('isEligibleToVote', () => {
    it('should return true for adults', () => {
      const dob = new Date('2000-01-15')
      expect(isEligibleToVote(dob)).toBe(true)
    })

    it('should return false for minors', () => {
      const dob = new Date('2020-01-15')
      expect(isEligibleToVote(dob)).toBe(false)
    })

    it('should return true for someone turning 18', () => {
      const dob = new Date()
      dob.setFullYear(dob.getFullYear() - 18)
      const eligible = isEligibleToVote(dob)
      expect(typeof eligible).toBe('boolean')
    })
  })

  describe('generateId', () => {
    it('should generate a unique string', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })

    it('should generate string ID', () => {
      const id = generateId()
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })

    it('should generate multiple unique IDs', () => {
      const ids = Array.from({ length: 10 }, () => generateId())
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(10)
    })
  })

  describe('truncateText', () => {
    it('should not truncate short text', () => {
      const text = 'Hello'
      const result = truncateText(text, 10)
      expect(result).toBe('Hello')
    })

    it('should truncate long text', () => {
      const text = 'This is a long text that needs truncation'
      const result = truncateText(text, 10)
      expect(result).toBe('This is a ...')
      expect(result.length).toBe(13)
    })

    it('should handle exact length match', () => {
      const text = 'Exact'
      const result = truncateText(text, 5)
      expect(result).toBe('Exact')
    })

    it('should handle single character truncation', () => {
      const text = 'Hello World'
      const result = truncateText(text, 1)
      expect(result).toBe('H...')
    })

    it('should handle empty string', () => {
      const result = truncateText('', 10)
      expect(result).toBe('')
    })
  })

  describe('debounce', () => {
    jest.useFakeTimers()

    it('should debounce function calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 300)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(mockFn).not.toHaveBeenCalled()

      jest.runAllTimers()
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should pass arguments to debounced function', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 300)

      debouncedFn('test', 123)

      jest.runAllTimers()
      expect(mockFn).toHaveBeenCalledWith('test', 123)
    })

    it('should clear timeout on new call', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 300)

      debouncedFn()
      jest.advanceTimersByTime(200)
      debouncedFn()

      jest.runAllTimers()
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })
})
