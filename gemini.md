The Prompt for gemini-cli
Act as an expert frontend developer specializing in Next.js. Your task is to convert the following single-file HTML application into a modern, lightweight Next.js (App Router) project structure. The final output must be optimized for a one-click deployment to Vercel.

Instructions:

Analyze the provided HTML, CSS, and JavaScript.

Recreate the functionality and styling within a new Next.js project structure.

Use the react-chartjs-2 library for Chart.js integration in React.

Generate all the necessary files separately, including configuration files and documentation.

Generate the following files:

package.json:

Include dependencies: react, react-dom, next, chart.js, react-chartjs-2.

Include devDependencies: postcss, tailwindcss, eslint, eslint-config-next.

Include standard scripts: dev, build, start, lint.

app/page.js:

This will be the main application component.

Mark it as a client component with 'use client'.

Translate the HTML structure into JSX.

Manage all state (volume, multiplier, results, errors) using the useState hook.

Port all JavaScript logic (calculation function, chart data generation) into this component.

Use the <Line> component from react-chartjs-2 to render the chart.

app/layout.js:

The root layout for the app.

Import and apply the 'Inter' font from next/font/google.

Define page title and description metadata.

app/globals.css:

Include the three base @tailwind directives.

Copy all custom CSS rules from the <style> tag of the original HTML file here.

tailwind.config.js:

A standard Tailwind configuration file, ensuring it scans the ./app/**/*.{js,ts,jsx,tsx,mdx} directory.

postcss.config.js:

A standard PostCSS configuration file with tailwindcss and autoprefixer.

next.config.mjs:

A standard, empty Next.js configuration file.

.gitignore:

A standard .gitignore file for a Next.js project.

README.md:

Provide updated instructions on how to install dependencies (npm install), run the project locally (npm run dev), and deploy it to Vercel.