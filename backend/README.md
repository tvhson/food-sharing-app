
# Running the Application with Docker Compose

This guide provides instructions on how to set up, run, stop, and restart the application using Docker Compose located in the `compose` folder.

---

## Prerequisites

  **Docker Installed**  
   Ensure Docker and Docker Compose are installed on your system.  
   - [Install Docker](https://docs.docker.com/get-docker/)  
   - [Install Docker Compose](https://docs.docker.com/compose/install/)

---

## How to Run the Application

1. **Navigate to the `compose` folder**  
   Open a terminal and go to the `compose` directory:
   ```bash
   cd backend/docker-compose/default/
   ```

2. **Start the Application**  
   Use the following command to start all services defined in the `docker-compose.yml` file:
   ```bash
   docker compose up -d
   ```
   - The `-d` flag runs the containers in detached mode (in the background).

3. **Verify Running Containers**  
   Check if all services are up and running:
   ```bash
   docker compose ps
   ```
   This will list all the running containers and their status.

---

## How to Stop the Application

1. **Stop All Services**  
   Run the following command to stop the running containers:
   ```bash
   docker compose down
   ```

2. **Remove Unused Containers (Optional)**  
   If you want to remove stopped containers and unused resources, you can use:
   ```bash
   docker system prune -f
   ```

---

## How to Restart the Application

1. **Restart All Services**  
   Use this command to restart all containers:
   ```bash
   docker-compose restart
   ```

2. **Stop and Start Services (Alternative)**  
   - Stop:
     ```bash
     docker-compose down
     ```
   - Start:
     ```bash
     docker-compose up -d
     ```

---

## Logs and Debugging

- **View Logs of All Services**  
  ```bash
  docker-compose logs -f
  ```
  The `-f` flag streams logs in real time.

- **View Logs of a Specific Service**  
  Replace `<service-name>` with the name of the service (defined in `docker-compose.yml`):
  ```bash
  docker-compose logs -f <service-name>
  ```

---

## Notes

- Ensure no other application is using the same ports as defined in `docker-compose.yml`.
- Update environment variables or configurations as needed in the `.env` file or directly in the `docker-compose.yml`.

--- 

For further assistance, contact the project maintainer.
