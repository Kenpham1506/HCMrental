# **HCMrental Website Style Guide**

## **1. Typography**

- **Font Family**: Choose a legible, modern sans-serif font like **Roboto**, **Lato**, or **Open Sans**.
- **Font Sizes**:
  - **Heading 1 (H1)**: 28-32px on Desktop, 22-26px on Mobile.
  - **Heading 2 (H2)**: 24-28px on Desktop, 20-24px on Mobile.
  - **Body Text**: 16-18px on Desktop, 14-16px on Mobile.
  - **Button Text**: 14-16px on both Mobile and Desktop.
- **Font Weight**: Use bold for headings and regular for body text.
- **Line Height**: 1.5 for readability.
- **Text Alignment**: Left-aligned for body text, center for headings when necessary.

## **2. Colors**

- **Primary Color**: Choose a strong and calming color like **#3498db** (blue) or **#27ae60** (green).
- **Secondary Color**: Complementary to the primary, like **#2980b9** (dark blue) or **#2ecc71** (light green).
- **Accent Colors**: Use sparingly for highlights or buttons, like **#e74c3c** (red) or **#f39c12** (yellow).
- **Text Colors**:
  - Headings: **#333333** (dark gray)
  - Body Text: **#666666** (medium gray)
  - Muted Text: **#999999** (light gray)
- **Background Color**: Use white **#ffffff** or very light shades of gray like **#f5f5f5** for a clean look.

## **3. Buttons and Interactions**

- **Primary Buttons**: Use the primary color for buttons, with white text. For example, **#3498db** button with **#ffffff** text.
  - Hover Effect: Darken by 10-15%.
- **Secondary Buttons**: Use the secondary color, with hover effects that lighten or darken by 10-15%.
- **Button Shape**: Rounded corners (4-6px radius) for a modern, soft look.
- **Padding**: 10px vertical and 20px horizontal for standard buttons.

## **4. Layout and Spacing**

- **Grid System**: Use a 12-column grid for responsive design.
  - Desktop: Columns should span the entire width of the page, with 10-15px margins.
  - Mobile: Collapse columns into stacked sections for easy navigation.
- **Spacing**:
  - Between sections: 40px on Desktop, 20px on Mobile.
  - Inside sections (padding): 20px on Desktop, 10px on Mobile.
- **Content Alignment**: Center key content, left-align text-heavy content for readability.

## **5. Icons and Imagery**

- **Icons**: Use a clean and modern icon set, such as **Material Icons** or **FontAwesome**.
  - Size: 24px for standard icons, 16px for smaller icons.
  - Color: Follow the primary or secondary color scheme.
- **Images**:
  - Use high-quality images (web-optimized).
  - Maintain a 4:3 aspect ratio for property photos.
  - Implement a responsive image carousel for property listings.
- **Hover Effects**: Slight zoom-in effect on images (scale 1.05) to add interactivity.

## **6. Forms and Inputs**

- **Input Fields**:
  - Border Color: Use light gray borders (**#cccccc**) with a slight rounded corner (4px).
  - Focus State: Border changes to primary color on focus, with a soft shadow for accessibility.
  - Input Padding: 12px for comfortable touch interaction on Mobile.
- **Submit Buttons**: Primary color buttons for actions like submitting forms or signing in.

## **7. Mobile Responsiveness**

- **Breakpoints**:
  - **Desktop**: 1024px and above.
  - **Tablet**: 768px to 1024px.
  - **Mobile**: 320px to 768px.
- **Navigation**:
  - Use a **hamburger menu** on mobile to collapse navigation.
  - Sticky navigation bar on mobile for easier access to key sections.
- **Touch Targets**: Ensure buttons and links are at least 48px in height for easy tapping.

## **8. Visual Hierarchy**

- **Headings**: Use a clear visual hierarchy (H1 > H2 > H3) with consistent font sizes and colors.
- **Call-to-Action (CTA)**: Bold and colorful to stand out (e.g., “Rent Now” buttons in primary color).
- **Whitespace**: Ensure adequate whitespace between elements for clarity and ease of navigation.

## **9. Cards and Listings**

- **Property Cards**:
  - Use a clean card layout with a shadow effect for elevation.
  - Include image, title, price, location, and status in a structured layout.
  - Responsive: Stack elements vertically on mobile.
- **Status Indicators**: Use color-coding (e.g., green for available, red for rented) for property availability.

## **10. Accessibility**

- **Contrast Ratio**: Ensure text and background colors have sufficient contrast (minimum 4.5:1 for body text).
- **Alt Text**: Use descriptive alt text for images, especially for property photos.
- **Keyboard Navigation**: Ensure all buttons and interactive elements can be navigated using the keyboard.

---

## **Tools to Implement**

- **CSS Frameworks**: Consider using **Bootstrap** or **Tailwind CSS** for faster, consistent design.
- **Responsive Testing**: Use tools like **Chrome DevTools** or **BrowserStack** to test across devices and screen sizes.
