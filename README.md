<h1>🎉 Event Management API</h1>

<p>
A simple yet powerful <strong>RESTful API</strong> for managing events and user registrations.<br>
Built using <strong>Node.js</strong>, <strong>Express</strong>, and <strong>PostgreSQL</strong>, with Docker support.
</p>

<hr>

<h2>🔧 Tech Stack</h2>

<ul>
  <li><strong>Backend</strong>: Node.js, Express</li>
  <li><strong>Database</strong>: PostgreSQL</li>
  <li><strong>ORM</strong>: <code>pg</code> (native PostgreSQL driver)</li>
  <li><strong>Environment Variables</strong>: dotenv</li>
  <li><strong>Utilities</strong>: CORS, Day.js</li>
  <li><strong>Containerization</strong>: Docker</li>
</ul>

<hr>

<h2>📁 Project Structure</h2>

<pre>
event-management-api/
├── backend/
│   ├── config/          # DB connection (db.js)
│   ├── controllers/     # Handles request logic
│   ├── models/          # Query models
│   ├── routes/          # Route definitions
│   ├── utils/           # Helper functions
│   ├── .env             # Environment variables
│   ├── server.js        # App entry point
│   └── package.json     # Project dependencies
├── README.md            # Project documentation
</pre>

<hr>

<h2>⚙️ Setup Instructions</h2>

<h3>📦 Prerequisites</h3>

<ul>
  <li>Node.js & npm</li>
  <li>Docker Desktop</li>
  <li>Git</li>
</ul>

<h3>🚀 Getting Started</h3>

<ol>
  <li><strong>Clone the Repository</strong>
    <pre>git clone https://github.com/aparnaannadura/event-management.git
cd event-management-api/backend</pre>
  </li>

  <li><strong>Start PostgreSQL with Docker</strong>
    <pre>docker run --name pg-container \
  -e POSTGRES_USER=aparna \
  -e POSTGRES_PASSWORD=secret123 \
  -e POSTGRES_DB=eventdb \
  -p 5432:5432 \
  -d postgres</pre>
  </li>

  <li><strong>Create <code>.env</code> file</strong>
    <pre>
DB_HOST=localhost
DB_PORT=5432
DB_USER=aparna
DB_PASSWORD=secret123
DB_NAME=eventdb
PORT=5000
    </pre>
  </li>

  <li><strong>Install Dependencies</strong>
    <pre>npm install</pre>
  </li>

  <li><strong>Set Up PostgreSQL Tables</strong>
    <pre>
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100),
  datetime TIMESTAMP,
  location VARCHAR(100),
  capacity INT
);

CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  event_id INT REFERENCES events(id),
  UNIQUE(user_id, event_id)
);
    </pre>
  </li>

  <li><strong>Start the Server</strong>
    <pre>node server.js</pre>
  </li>
</ol>

<hr>

<h2>📬 API Endpoints</h2>

<h3>📌 Event Routes</h3>

<table>
  <thead>
    <tr><th>Method</th><th>Endpoint</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td>POST</td><td>/api/events</td><td>Create a new event</td></tr>
    <tr><td>GET</td><td>/api/events/:id</td><td>Get event details + users</td></tr>
    <tr><td>POST</td><td>/api/events/register</td><td>Register a user</td></tr>
    <tr><td>DELETE</td><td>/api/events/cancel</td><td>Cancel registration</td></tr>
    <tr><td>GET</td><td>/api/events/upcoming</td><td>Upcoming events</td></tr>
    <tr><td>GET</td><td>/api/events/:id/stats</td><td>Event stats</td></tr>
  </tbody>
</table>

<h3>📌 User Routes</h3>

<table>
  <thead>
    <tr><th>Method</th><th>Endpoint</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td>POST</td><td>/api/users</td><td>Create a new user</td></tr>
  </tbody>
</table>

<hr>

<h2>🧪 Sample Request</h2>

<pre><strong>POST</strong> /api/events/register</pre>

<pre>{
  "userId": 1,
  "eventId": 3
}</pre>

<hr>

<h2>📊 Sample Response - Event Stats</h2>

<pre>{
  "totalRegistrations": 50,
  "remainingCapacity": 50,
  "percentUsed": "50.00%"
}</pre>

<hr>

<h2>🧠 Features</h2>

<ul>
  <li>Prevent duplicate registration</li>
  <li>Disallow past event registrations</li>
  <li>Enforce capacity limits</li>
  <li>View registration stats</li>
  <li>Proper error handling</li>
</ul>

<hr>

<h2>🔗 Links</h2>

<ul>
  <li><strong>GitHub</strong>: <a href="https://github.com/aparnaannadura/event-management" target="_blank">aparnaannadura/event-management</a></li>
</ul>

<hr>

<h2>🙋‍♀️ Made By</h2>

<p>
<strong>Aparna Annadurai</strong> <br>
Passionate backend developer | MERN Stack | Focused on scalable systems 🚀
</p>
