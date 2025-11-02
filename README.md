#Access My Website here - https://tria-assignment-gold.vercel.app/

# Tria Contacts

Tria Contacts is a modern React-based contact manager designed for an intuitive, responsive, and visually polished user experience.  
The project began as a simple contact list and evolved into a complete mini contact management system with editing, validation, image upload, and a recycle bin.

---

## Overview

This project demonstrates modern React development with clean UI, smooth interactions, and browser-based data persistence.  
It focuses on usability, clarity, and functionality — without relying on any external backend or frameworks beyond React and CSS utilities.

---

## Features

### Interface and Layout
- Full-page, responsive layout that scales well on all screen sizes.
- Gradient navigation bar with the Tria logo and title.
- Proper alignment and spacing using CSS Grid and Flexbox.
- Smooth hover and focus transitions for interactive buttons and cards.

### Contact Management
- Add new contacts with validation for name, email, phone number, and country code.
- Edit or delete existing contacts using a modal form.
- Upload and preview a profile photo while creating or editing a contact.
- Modify and delete buttons appear only on hover for a cleaner UI.
- Automatic detection and merge option for contacts with duplicate phone numbers.

### Recycle Bin
- Soft delete system that moves deleted contacts to a Recycle Bin.
- Restore contacts or permanently delete them from the bin.
- Automatic cleanup of older deleted contacts (after 7 days).

### Search and Filtering
- Real-time search with input debounce for improved performance.
- Searches across both names and email addresses.
- Count indicator showing how many results match the search term.

### Data Persistence
- All contacts and deleted items are saved in the browser using LocalStorage.
- Data automatically reloads on refresh.
- Includes a reset option to restore the default contact list.

### Input Validation
- Email validation for format correctness.
- Phone number validation allowing only digits (6–15 digits).
- Country code selector for major regions such as +91, +1, +44, and +61.

### Visual Details
- Smooth gradients and subtle shadows on cards and buttons.
- Rounded avatars with initials fallback when no photo is uploaded.
- Consistent color palette and typography for a clean, modern aesthetic.
- Fully keyboard-accessible modals and buttons.

---

## Technology Stack

- React (version 18 or newer)
- Tailwind CSS and custom CSS
- JavaScript (ES6+)
- LocalStorage (browser-based data persistence)

---

## Installation

Follow the steps below to run the project locally.

### Using Vite (recommended)
```bash
# Clone the repository
git clone https://github.com/yourusername/tria-contacts.git

# Move into the project directory
cd tria-contacts

# Install dependencies
npm install

# Run the development server
npm run dev
```

Then open your browser and go to `http://localhost:5173`

---

## Project Structure

```
src/
 ├─ App.jsx          Main React component (UI logic and app state)
 ├─ App.css          Styles for layout and responsiveness
 ├─ components/      Optional reusable UI components
 └─ assets/          Logo, icons, and image assets
```

---

## Recycle Bin Behavior

| Action             | Result                                          |
|--------------------|-------------------------------------------------|
| Delete Contact     | Moves the contact to the Recycle Bin            |
| Restore Contact    | Moves the contact back to the main list         |
| Empty Bin          | Permanently deletes all contacts in the bin     |
| Auto Purge         | Removes contacts older than 7 days automatically|

---

## User Experience Notes

- The "Add Contact" button includes hover scaling and a focus ring.
- Input focus automatically starts on the name field when adding a new contact.
- Cards lift slightly on hover for a subtle visual response.
- Works smoothly across Chrome, Edge, and Safari.
- The UI maintains consistent spacing and sizing on all devices.

---

## Data Handling

All data is stored locally in the browser using LocalStorage.  
No external API calls or server interactions are performed.  
This makes the app fully offline-ready for testing and demonstration.

---

## Future Enhancements

- Add dark mode support.
- Sorting options by name or most recently edited contact.
- Import and export contacts in CSV format.
- Group contacts by category or label.
- Optional backend integration for cloud synchronization.

---

## License

This project is open source under the MIT License.  
You are free to use, modify, and distribute it for learning or personal use.

---

## Author

Developed as a hands-on learning and design project focused on code readability, maintainability, and user experience.
