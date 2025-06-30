/**
 * Utility functions for scroll behavior
 */

/**
 * Scroll to top of the page with smooth animation
 */
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * Scroll to a specific element with smooth animation
 * @param {string} selector - CSS selector for the target element
 * @param {number} offset - Optional offset from the top (default: 0)
 */
export const scrollToElement = (selector, offset = 0) => {
  const element = document.querySelector(selector)
  if (element) {
    const elementPosition = element.offsetTop - offset
    window.scrollTo({ top: elementPosition, behavior: 'smooth' })
  }
}

/**
 * Scroll to a specific position with smooth animation
 * @param {number} position - Position to scroll to
 */
export const scrollToPosition = (position) => {
  window.scrollTo({ top: position, behavior: 'smooth' })
}

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @returns {boolean} - True if element is in viewport
 */
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * Add scroll to top behavior to RouterLink components
 * @param {Vue} component - Vue component instance
 */
export const addScrollToTopToRouterLinks = (component) => {
  // This can be used to automatically add scroll to top to all RouterLinks
  // Implementation depends on specific use case
  console.log('Scroll to top utility loaded for component:', component.$options.name)
} 