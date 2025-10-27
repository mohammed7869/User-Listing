# Admin User Listing

A modern React admin panel with user management, featuring a clean UI built with Tailwind CSS and Shadcn components.

## Features

- 🔐 **Login Page** - Secure authentication with demo credentials
- 👥 **User Listing** - View and manage users with filtering and search
- 📊 **Dashboard Stats** - Track active users, administrators, and managers
- 🎨 **Modern UI** - Built with Tailwind CSS and Shadcn UI components
- 🔍 **Search & Filter** - Find users quickly by name, email, or role
- 📱 **Responsive Design** - Works seamlessly on all devices

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Login Credentials

- **Email:** admin@example.com
- **Password:** admin123

## Project Structure

```
├── src/
│   ├── components/
│   │   └── ui/          # Shadcn UI components
│   ├── layouts/
│   │   └── AdminLayout.jsx    # Admin layout with header
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   └── UserListing.jsx     # User listing page
│   ├── lib/
│   │   └── utils.js            # Utility functions
│   ├── App.jsx                 # Main app component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── package.json
├── tailwind.config.js
├── vite.config.js
└── index.html
```

## Tech Stack

- **React 18** - UI framework
- **React Router** - Navigation
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Shadcn UI** - UI component library
- **Lucide React** - Icons
- **Radix UI** - Headless UI primitives

## Features Breakdown

### Login Page

- Clean, centered design
- Form validation
- Demo credentials display
- Gradient background

### Admin Dashboard

- Sticky header with user dropdown
- Statistics cards showing user counts
- Search functionality
- Status filtering (All, Active, Inactive)
- User cards with avatar, contact info, and actions

## Customization

### Adding More Users

Edit the `initialUsers` array in `src/pages/UserListing.jsx`:

```javascript
const initialUsers = [
  // Add your users here
];
```

### Styling

The project uses Tailwind CSS with custom color scheme defined in `src/index.css`. Modify the CSS variables to change the theme.

## License

MIT
