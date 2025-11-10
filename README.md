
  # Executive Dashboard Overview

  This is a code bundle for Executive Dashboard Overview. The original project is available at https://www.figma.com/design/aKZlNo60ZahLbdTplJnGl8/Executive-Dashboard-Overview.

  ## Running the code

  Run `npm i` to install the dependencies.

  ### Backend API
  This app expects the external .NET Core backend to be running at `https://localhost:7189/api/fhl`. That backend is responsible for calling `fhl2.set_tenant(...)`, `fhl2.api_tenant_directory_json(...)`, and `fhl2.api_ar_widget_json(...)`.

  1. Copy `.env.example` to `.env`.
  2. Ensure `VITE_API_BASE_URL` points to your .NET endpoint and `VITE_DEFAULT_TENANT` matches a valid tenant (e.g., `Omega`).

  ### Frontend
  With the .NET backend running, start the Vite dev server:

  ```
  npm run dev
  ```
  
