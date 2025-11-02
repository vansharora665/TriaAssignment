# React + Vite

You can visit my website here - https://tria-assignment-gold.vercel.app/

FEATURES

INTERFACE AND LAYOUT

Full-page responsive layout that adapts to all screen sizes.

Clean gradient navbar with a custom Tria logo and title.

Smooth hover animations and button transitions for better user experience.

Proper alignment and spacing using CSS grid and flex layouts.

CONTACT MANAGEMENT

Add new contacts with validation for name, email, phone number, and country code.

Upload a profile photo while creating or editing a contact (stored locally as Base64).

Modify and Delete buttons appear only on hover to keep the interface clean.

Edit existing contacts directly through the modal form.

Merge duplicate contacts based on the same phone number (user can choose to merge or keep both).

RECYCLE BIN

Soft delete system that moves deleted contacts to a recycle bin.

Restore or permanently delete contacts from the bin.

Auto-cleanup of old trash items after a fixed time period (7 days by default).

SEARCH AND FILTERING

Instant search feature with debounce for smoother performance.

Search works across both names and email addresses.

Count indicator shows how many contacts match the search.

DATA PERSISTENCE

Contacts and trash are stored locally in the browser using LocalStorage.

Data is automatically saved and reloaded on refresh.

Includes a reset option to restore the default contact list.

INPUT VALIDATION

Email format validation.

Phone number validation allowing only digits (6–15 digits allowed).

Country code selector with options like +91, +1, +44, and +61.

VISUAL DETAILS

Gradient accent colors in indigo, purple, and pink shades.

Lifted contact cards with soft shadows.

Rounded avatars with initials shown when no profile photo is uploaded.

Clean typography and spacing implemented with Tailwind utilities and CSS.

TECH STACK

React (version 18 or later)

Tailwind CSS and custom CSS

LocalStorage for data persistence

JavaScript (ES6+)

INSTALLATION AND SETUP

Clone the repository:
git clone https://github.com/yourusername/tria-contacts.git

Navigate to the project directory:
cd tria-contacts

Install the dependencies:
npm install

Run the development server:
npm run dev

Open your browser and go to http://localhost:5173

PROJECT STRUCTURE

src/
├─ App.jsx -> Main React component
├─ App.css -> Styles for full layout and responsiveness
├─ components/ -> Optional reusable subcomponents (Navbar, Card, Modal)
└─ assets/ -> Logo and image files

RECYCLE BIN BEHAVIOR
Action | Result

Delete Contact | Moves the contact to the Recycle Bin
Restore Contact | Moves the contact back to the main list
Empty Bin | Permanently deletes all items in the bin
Auto Purge | Automatically removes items older than 7 days

USER EXPERIENCE DETAILS

Focus automatically goes to the name field when adding a new contact.

Hover shadows and smooth transformations on contact cards.

The "Add Contact" button slightly scales up on hover.

Modals and buttons are keyboard accessible.

Works seamlessly on Chrome, Edge, and Safari browsers.

DATA HANDLING

All data is stored locally in the browser using LocalStorage.
No external APIs or servers are used.
No personal data is sent or tracked.

FUTURE IMPROVEMENTS

Add a dark mode toggle.

Add sorting by name or most recent edits.

Export and import contacts as CSV files.

Add contact groups or labels.

Add optional cloud synchronization.

AUTHOR

This project was built manually with a focus on clear code structure, clean design, and usability.
