import request from 'supertest';
import app from '../src/app';

describe('Task & Dashboard API Suite', () => {
  let userAToken: string;
  let userACookie: string[];
  let userBToken: string;

  beforeEach(async () => {
    // Register User A
    const resA = await request(app).post('/api/v1/auth/register').send({
      name: 'User A',
      email: 'userA@taskflow.dev',
      password: 'Password123!',
    });
    userAToken = resA.body.data.token;
    userACookie = resA.headers['set-cookie'] as unknown as string[];

    // Register User B
    const resB = await request(app).post('/api/v1/auth/register').send({
      name: 'User B',
      email: 'userB@taskflow.dev',
      password: 'Password123!',
    });
    userBToken = resB.body.data.token;
  });

  describe('POST /api/v1/tasks (Create Task)', () => {
    it('should create a task successfully with valid data', async () => {
      const taskData = {
        title: 'Implement Authentication',
        description: 'Set up JWT and HTTP-only cookies',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 86400000).toISOString(),
      };

      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Cookie', userACookie)
        .send(taskData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(taskData.title);
      expect(res.body.data.status).toBe('IN_PROGRESS');
      expect(res.body.data.priority).toBe('HIGH');
      expect(res.body.data._id).toBeDefined();
    });

    it('should reject task creation with missing title', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          description: 'No title provided',
          dueDate: new Date().toISOString(),
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject unauthorized creation attempt without token', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .send({ title: 'Rogue Task', dueDate: new Date().toISOString() });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/tasks & Search, Filter, Pagination', () => {
    beforeEach(async () => {
      // Seed tasks for User A
      const tasks = [
        {
          title: 'Design Landing Page',
          description: 'Figma mockups and design system',
          status: 'COMPLETED',
          priority: 'LOW',
          dueDate: new Date(Date.now() - 86400000).toISOString(), // overdue/past
        },
        {
          title: 'Implement API Routes',
          description: 'Express controllers and routers',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        },
        {
          title: 'Setup MongoDB Atlas',
          description: 'Database provisioning and indexing',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        },
      ];

      for (const t of tasks) {
        await request(app)
          .post('/api/v1/tasks')
          .set('Authorization', `Bearer ${userAToken}`)
          .send(t);
      }

      // Seed task for User B (to ensure cross-user isolation)
      await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${userBToken}`)
        .send({
          title: 'User B Secret Task',
          status: 'TODO',
          priority: 'HIGH',
          dueDate: new Date().toISOString(),
        });
    });

    it('should list only User A tasks with pagination metadata', async () => {
      const res = await request(app)
        .get('/api/v1/tasks?page=1&limit=2')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination.total).toBe(3);
      expect(res.body.pagination.totalPages).toBe(2);
      expect(res.body.pagination.hasNextPage).toBe(true);
    });

    it('should filter tasks by status', async () => {
      const res = await request(app)
        .get('/api/v1/tasks?status=COMPLETED')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe('Design Landing Page');
    });

    it('should filter tasks by priority', async () => {
      const res = await request(app)
        .get('/api/v1/tasks?priority=HIGH')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe('Implement API Routes');
    });

    it('should search tasks by keyword in title or description', async () => {
      const res = await request(app)
        .get('/api/v1/tasks?search=database')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe('Setup MongoDB Atlas');
    });
  });

  describe('Task Details, Updates & Cross-User Security', () => {
    let userATaskId: string;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          title: 'Proprietary Architecture Doc',
          description: 'Classified documentation',
          status: 'TODO',
          priority: 'HIGH',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
        });

      userATaskId = res.body.data._id;
    });

    it('should allow User A to retrieve their own task', async () => {
      const res = await request(app)
        .get(`/api/v1/tasks/${userATaskId}`)
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Proprietary Architecture Doc');
    });

    it('should REJECT User B attempting to view User A task', async () => {
      const res = await request(app)
        .get(`/api/v1/tasks/${userATaskId}`)
        .set('Authorization', `Bearer ${userBToken}`);

      expect(res.status).toBe(404); // Returns 404 unauthorized/not found to avoid resource leakage
    });

    it('should allow User A to update task fields', async () => {
      const res = await request(app)
        .patch(`/api/v1/tasks/${userATaskId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          title: 'Updated Architecture Doc',
          status: 'IN_PROGRESS',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Updated Architecture Doc');
      expect(res.body.data.status).toBe('IN_PROGRESS');
    });

    it('should update task status via dedicated status endpoint', async () => {
      const res = await request(app)
        .patch(`/api/v1/tasks/${userATaskId}/status`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ status: 'COMPLETED' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('COMPLETED');
    });

    it('should REJECT User B attempting to delete User A task', async () => {
      const res = await request(app)
        .delete(`/api/v1/tasks/${userATaskId}`)
        .set('Authorization', `Bearer ${userBToken}`);

      expect(res.status).toBe(404);
    });

    it('should allow User A to delete their own task', async () => {
      const res = await request(app)
        .delete(`/api/v1/tasks/${userATaskId}`)
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(200);

      // Verify deletion
      const checkRes = await request(app)
        .get(`/api/v1/tasks/${userATaskId}`)
        .set('Authorization', `Bearer ${userAToken}`);

      expect(checkRes.status).toBe(404);
    });
  });

  describe('Dashboard Analytics (/api/v1/dashboard/stats)', () => {
    beforeEach(async () => {
      // 1 Completed, 1 In-Progress, 1 Overdue TODO
      await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          title: 'Completed Task',
          status: 'COMPLETED',
          priority: 'LOW',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
        });

      await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          title: 'In Progress Task',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        });

      await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          title: 'Overdue Todo Task',
          status: 'TODO',
          priority: 'HIGH',
          dueDate: new Date(Date.now() - 86400000 * 2).toISOString(), // past date
        });
    });

    it('should aggregate dashboard metrics accurately from MongoDB', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard/stats')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      const stats = res.body.data;
      expect(stats.totalTasks).toBe(3);
      expect(stats.completedTasks).toBe(1);
      expect(stats.inProgressTasks).toBe(1);
      expect(stats.pendingTasks).toBe(1);
      expect(stats.overdueTasks).toBe(1);
      expect(stats.completionRate).toBe(33);
      expect(stats.statusDistribution.length).toBe(3);
      expect(stats.priorityDistribution.length).toBe(3);
    });

    it('should return recent tasks and upcoming deadlines', async () => {
      const recentRes = await request(app)
        .get('/api/v1/dashboard/recent-tasks')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(recentRes.status).toBe(200);
      expect(recentRes.body.data.length).toBe(3);

      const upcomingRes = await request(app)
        .get('/api/v1/dashboard/upcoming-tasks')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(upcomingRes.status).toBe(200);
      expect(upcomingRes.body.data.length).toBe(1); // Only non-completed and future due date
      expect(upcomingRes.body.data[0].title).toBe('In Progress Task');
    });
  });
});
