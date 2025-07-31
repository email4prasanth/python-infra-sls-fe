# Lumifi-FE

A React-based application.

## **Getting Started**

### **Prerequisites**

- Node.js

### **Local Setup**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Kazisu/lumifi-frontend.git
   cd lumifi-frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env.dev` file in the root directory and add the required variables.

---

### **Running the Application**

Start the development server:

```bash
npm run start:dev
```

The app will be available at: [http://localhost:3000](http://localhost:3000)

---

### **Code Quality Commands**

- **Linting:**

  ```bash
  npm run lint        # Check for linting errors
  npm run lint:fix    # Auto-fix linting issues
  ```

- **Formatting:**

  ```bash
  npm run format:check  # Check code formatting
  npm run format:fix    # Auto-fix formatting issues
  ```

---

## **Technology Stack**

### **Core Libraries**

- **React** - Frontend library for building user interfaces
- **TypeScript** - Static type-checking for JavaScript
- **Vite** - Next-generation build tool for faster development

### **UI Framework & Styling**

- **Tailwind CSS** - Utility-first CSS framework for styling

### **State Management & Routing**

- **Redux Toolkit** & **React Redux** - Efficient state management
- **Redux Persist** - State persistence for Redux
- **React Router** - Declarative routing for React apps

### **Internationalization**

- **i18next** & **react-i18next** - Framework for internationalization support

### **Development Tools**

- **ESLint** - Code linting for best practices
- **Prettier** - Code formatting tool
- **TypeScript ESLint** - Linting for TypeScript code

### **Testing library**

- **Jest** - Testing library

---

## **Project Structure**

```
lumifi-frontend/
│
├── src/
│   ├── assets/             # Static assets
│   ├── config/             # Configuration files
│   ├── lib/                # Core libraries
│   │   ├── ui/             # Shared UI components
│   │   └── utils/          # Utility functions
│   ├── lumifi/             # Core functionalities
│   │   ├── mocks/          # Mock data
│   │   ├── api/            # API integration
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page-level components
│   │   ├── presentations/  # Presentation components
│   │   ├── routes/         # Route definitions
│   │   ├── themes/         # Theme configuration
│   │   └── types/          # TypeScript type definitions
│   ├── store/              # Redux store configuration
│   ├── App.tsx             # Root React component
│   ├── index.css/          # Global CSS styles
│   └── main.tsx            # Entry point of the application
├── .env.dev                # Environment variables for development
├── .env.prod               # Environment variables for production
├── README.md               # Project documentation
├── package.json            # Project dependencies and scripts
└── other config files      # Other configuration files

```

---

## **Environment Setup**

The application uses Vite's environment mode system:

- **Development:** `.env.dev`
- **Production:** `.env.prod`

Make sure to configure the necessary environment variables in these files before running the app.

---
