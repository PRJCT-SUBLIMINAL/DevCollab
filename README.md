Setup:
  
  - nvm use (.nvmrc must be available in the root folder)
  - npm install
  - docker compose up -d
  
Initialize Database:

  - npm run db:push

Testing:

  - npm run dev (build dist and start up the server);
  - Load http://localhost:8080/ in your web browser to fire API tests
