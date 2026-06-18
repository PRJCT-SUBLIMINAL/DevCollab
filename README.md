Setup:
  
  - nvm use
  - npm install
  - docker compose up -d
  
Initialize Database:

  - npm run generate
  - npm run migrate

Testing:

  - npm run dev (build dist and start up the server);
  - Load http://localhost:8080/ in your web browser to fire API tests